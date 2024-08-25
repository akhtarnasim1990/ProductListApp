# React Knowledge - Q&A

## 1. What is the difference between `Component` and `PureComponent`? Give an example where it might break my app.

- **`Component`:**

  - `Component` is the base class for React components. It re-renders the component whenever `setState` is called, even if the state or props haven't changed.
  - Example:
    ```javascript
    class MyComponent extends React.Component {
      render() {
        console.log("Rendering MyComponent");
        return <div>{this.props.text}</div>;
      }
    }
    ```
    This component will re-render every time `setState` is invoked, regardless of whether `props.text` has changed or not.

- **`PureComponent`:**

  - `PureComponent` is a subclass of `Component` that implements `shouldComponentUpdate` with a shallow prop and state comparison. It prevents unnecessary re-renders when the state or props have not changed.
  - Example:
    ```javascript
    class MyPureComponent extends React.PureComponent {
      render() {
        console.log("Rendering MyPureComponent");
        return <div>{this.props.text}</div>;
      }
    }
    ```
    This component will only re-render if `props.text` or any other prop/state changes.

- **Potential Issue:**
  - If the state or props contain complex data structures (like objects or arrays), `PureComponent` might incorrectly skip re-renders because it only performs a shallow comparison. For instance, if you pass a new object with the same properties, `PureComponent` will not re-render:
    ```javascript
    this.setState({ data: { value: 1 } });
    ```

### 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

Using `Context` with `shouldComponentUpdate` (or `PureComponent`) can be dangerous because `Context` changes do not trigger `shouldComponentUpdate`. Even if a parent component’s context value changes, a child component using `shouldComponentUpdate` might not re-render because `shouldComponentUpdate` doesn't track context updates.

This can lead to components not responding to context changes, causing inconsistent UI states.

## 3. Describe 3 ways to pass information from a component to its PARENT.

1. **Callback Function:**

   - Pass a function from the parent to the child as a prop. The child can call this function with the data it needs to pass back.
   - Example:

     ```javascript
     const Parent = () => {
       const handleData = (data) => console.log(data);
       return <Child onData={handleData} />;
     };

     const Child = ({ onData }) => {
       onData("Some data");
       return <div>Child Component</div>;
     };
     ```

2. **State Lifting:**

   - Lift the state up to the nearest common ancestor so that the parent can directly manage and pass the state down as props.
   - Example:

     ```javascript
     const Parent = () => {
       const [value, setValue] = useState("");
       return <Child value={value} onChange={setValue} />;
     };

     const Child = ({ value, onChange }) => {
       return <input value={value} onChange={(e) => onChange(e.target.value)} />;
     };
     ```

3. **Context API:**

   - Use the Context API to allow a parent component to listen to changes from deeply nested child components.
   - Example:

     ```javascript
     import React, { useState, useContext } from "react";
     const MyContext = React.createContext();

     const Parent = () => {
       const [value, setValue] = useState("");
       return (
         <MyContext.Provider value={{ value, setValue }}>
           <Child />
         </MyContext.Provider>
       );
     };

     const Child = () => {
       const { setValue } = useContext(MyContext);
       setValue("New Value");
       return <div>Child Component</div>;
     };
     ```

## 4. Give 2 ways to prevent components from re-rendering.

1. **Using `React.memo`:**

   - `React.memo` is a higher-order component that prevents functional components from re-rendering if their props haven't changed.
   - Example:
     ```javascript
     const MyComponent = React.memo(({ value }) => {
       return <div>{value}</div>;
     });
     ```

2. **Implementing `shouldComponentUpdate`:**

   - For class components, you can use the `shouldComponentUpdate` lifecycle method to control re-rendering.
   - Example:

     ```javascript
     class MyComponent extends React.Component {
       shouldComponentUpdate(nextProps) {
         return nextProps.value !== this.props.value;
       }

       render() {
         return <div>{this.props.value}</div>;
       }
     }
     ```

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

- **Fragment:**

  - A fragment (`<React.Fragment> or <>`) allows you to group multiple elements without adding extra nodes to the DOM. This is useful when you need to return multiple elements from a component without wrapping them in a parent div.

- **Example:**

  ```javascript
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  );
  ```

- **Potential Issue:**
  - Fragments don’t support attributes (except `key`), so if you try to add an attribute like `className` to a fragment, it will cause an error:
    ```javascript
    return (
      <React.Fragment className="my-class">
        <h1>Title</h1>
        <p>Paragraph</p>
      </React.Fragment>
    );
    ```

## 6. Give 3 examples of the HOC pattern.

1. **`withRouter`:**

   - Provides routing-related props to a component.
   - Example:
     ```javascript
     import { withRouter } from "react-router-dom";
     const MyComponent = ({ location }) => <div>{location.pathname}</div>;
     export default withRouter(MyComponent);
     ```

2. **`connect`:**

   - Connects a component to a Redux store.
   - Example:
     ```javascript
     import { connect } from "react-redux";
     const MyComponent = ({ user }) => <div>{user.name}</div>;
     const mapStateToProps = (state) => ({ user: state.user });
     export default connect(mapStateToProps)(MyComponent);
     ```

3. **`withAuth`:**
   - Adds authentication logic to a component.
   - Example:
     ```javascript
     const withAuth = (Component) => (props) => {
       const isAuthenticated = useAuth();
       return isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />;
     };
     const MyComponent = () => <div>Protected Content</div>;
     export default withAuth(MyComponent);
     ```

## 7. What's the difference in handling exceptions in promises, callbacks, and async/await?

- **Promises:**

  - Errors are caught using `.catch()` method.
  - Example:
    ```javascript
    fetch("/api/data")
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));
    ```

- **Callbacks:**

  - Errors are passed as the first argument in callbacks following the Node.js convention.
  - Example:

    ```javascript
    function fetchData(callback) {
      setTimeout(() => {
        callback("Error occurred", null);
      }, 1000);
    }

    fetchData((error, data) => {
      if (error) {
        console.error("Error:", error);
      } else {
        console.log(data);
      }
    });
    ```

- **Async/Await:**
  - Errors are handled using `try/catch` blocks.
  - Example:
    ```javascript
    async function fetchData() {
      try {
        const response = await fetch("/api/data");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchData();
    ```

## 8. How many arguments does `setState` take and why is it async?

- **Arguments:**

  - `setState` takes two arguments:
    1. The first argument is the new state (either an object or a function that returns the new state).
    2. The second optional argument is a callback function that is executed once the state is updated.
    ```javascript
    this.setState({ count: this.state.count + 1 }, () => {
      console.log("State updated");
    });
    ```

- **Why is it async?**
  - `setState` is asynchronous to batch multiple state updates together, improving performance by reducing

the number of re-renders. React batches state updates and re-renders the component only after all updates are processed.

## 9. List the steps needed to migrate a Class to Function Component.

1. **Remove the Class Definition:**
   - Replace the class declaration with a function declaration.
2. **Convert State to `useState` Hook:**

   - Replace `this.state` and `this.setState` with `useState` hook.

   ```javascript
   const [state, setState] = useState(initialState);
   ```

3. **Replace Lifecycle Methods:**

   - Convert lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) to `useEffect` hooks.

   ```javascript
   useEffect(() => {
     // componentDidMount logic
     return () => {
       // componentWillUnmount logic
     };
   }, [dependencies]); // componentDidUpdate logic
   ```

4. **Remove `this`:**

   - Replace `this.props` and `this.state` with direct usage of `props` and `state`.

5. **Remove Binding:**

   - Remove any `this.methodName.bind(this)` since functions in functional components don’t need binding.

6. **Handle Context with `useContext`:**

   - Replace `this.context` with the `useContext` hook.

7. **Use `useRef` for Refs:**

   - Replace `React.createRef()` with `useRef`.

8. **Update Render Method:**
   - Replace the `render` method with the return statement in the function component.

## 10. List a few ways styles can be used with components.

1. **CSS Stylesheets:**

   - Importing a CSS file and using class names.

   ```javascript
   import "./styles.css";
   const MyComponent = () => <div className="my-class">Hello</div>;
   ```

2. **Inline Styles:**

   - Using the `style` attribute.

   ```javascript
   const MyComponent = () => <div style={{ color: "red" }}>Hello</div>;
   ```

3. **CSS Modules:**

   - Importing a CSS module for scoped styles.

   ```javascript
   import styles from "./MyComponent.module.css";
   const MyComponent = () => <div className={styles.myClass}>Hello</div>;
   ```

4. **Sass/SCSS:**
   - Using Sass for advanced styling features.
   ```scss
   .my-class {
     color: red;
   }
   ```

## 11. How to render an HTML string coming from the server?

- **Using `dangerouslySetInnerHTML`:**
  - React provides `dangerouslySetInnerHTML` to render HTML strings. This should be used with caution as it can lead to XSS attacks if the HTML content isn't sanitized.
  ```javascript
  const MyComponent = ({ htmlString }) => <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  ```
