import { useEffect, useState } from "react";
import "./App.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";

interface Todo {
  title: string;
  description: string;
  completedDate?: string;
}
interface TodoListProps {
  todos: Todo[];
}

function App() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [todos, setTodos] = useState<TodoListProps>({ todos: [] });
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [editItem, setEditItem] = useState<number | null>(null);
  const [currentEditedTodo, setCurrentEditedTodo] = useState<Todo | null>(null);

  const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
  const capitalizedDescription =
    description.charAt(0).toUpperCase() + description.slice(1);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      const newTodo = {
        title: capitalizedTitle,
        description: capitalizedDescription,
      };
      const updatedTodos = [...todos.todos];
      updatedTodos.push(newTodo);
      setTodos({ todos: updatedTodos });
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setTitle("");
      setDescription("");
    }
  };

  const handleAddTodo = () => {
    const newTodo = {
      title: capitalizedTitle,
      description: capitalizedDescription,
    };

    const updatedTodos = [...todos.todos];
    updatedTodos.push(newTodo);
    setTodos({ todos: updatedTodos });
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setTitle("");
    setDescription("");
  };

  const handleDeleteTodo = (index: number) => {
    const reduceTodo = [...todos.todos];
    reduceTodo.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(reduceTodo));
    setTodos({ todos: reduceTodo });
  };

  const handleComplete = (index: number) => {
    const now = new Date();
    const dd = now.getDate();
    const mm = now.getMonth() + 1;
    const yyyy = now.getFullYear();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const completedDate = `${dd}/${mm}/${yyyy} ${h}:${m}:${s}`;

    const filteredItem = {
      ...todos.todos[index],
      completedDate: completedDate,
    };

    const updatedCompletedTodos = [...completedTodos];
    updatedCompletedTodos.push(filteredItem);
    setCompletedTodos(updatedCompletedTodos);
    handleDeleteTodo(index);
    localStorage.setItem(
      "completedTodos",
      JSON.stringify(updatedCompletedTodos)
    );
  };

  const handleDeleteCompletedTodo = (index: number) => {
    const reduceCompletedTodo = [...completedTodos];
    reduceCompletedTodo.splice(index, 1);
    localStorage.setItem("completedTodos", JSON.stringify(reduceCompletedTodo));
    setCompletedTodos(reduceCompletedTodo);
  };

  const handleEdit = (index: number, todo: Todo) => {
    setEditItem(index);
    setCurrentEditedTodo(todo);
  };

  const handleUpdateTitle = (value: string) => {
    setCurrentEditedTodo((prev) => {
      return {
        ...prev!,
        title: value,
      };
    });
  };

  const handleUpdateDescription = (value: string) => {
    setCurrentEditedTodo((prev) => {
      return {
        ...prev!,
        description: value,
      };
    });
  };

  const handleUpdateTodo = () => {
    const finalEditedTodo = { ...currentEditedTodo };

    // --- Apply Capitalization to the first letter ---
    if (finalEditedTodo.title) {
      // Check if title is not empty before capitalizing
      finalEditedTodo.title =
        finalEditedTodo.title.charAt(0).toUpperCase() +
        finalEditedTodo.title.slice(1);
    }
    if (finalEditedTodo.description) {
      // Check if description is not empty before capitalizing
      finalEditedTodo.description =
        finalEditedTodo.description.charAt(0).toUpperCase() +
        finalEditedTodo.description.slice(1);
    }
    const updatedTodos = [...todos.todos];
    if (finalEditedTodo.title && finalEditedTodo.description) {
      updatedTodos[editItem!] = finalEditedTodo as Todo;
    }
    setTodos({ todos: updatedTodos });
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setEditItem(null);
    setCurrentEditedTodo(null);
  };

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos")
      ? JSON.parse(localStorage.getItem("todos") as string)
      : [];
    const storedCompletedTodos = localStorage.getItem("completedTodos")
      ? JSON.parse(localStorage.getItem("completedTodos") as string)
      : [];
    if (storedCompletedTodos) {
      setCompletedTodos(storedCompletedTodos);
    }

    if (storedTodos) {
      setTodos({ todos: storedTodos });
    }
  }, []);

  return (
    <>
      <div className="App">
        
        <h1>Task Manager</h1>
        <div className="todo-wrapper">
          <div className="todo-input">
            <div className="todo-input-item">
              <label htmlFor="Title">Title</label>
              <input
                type="text"
                name="Title"
                value={title}
                onChange={handleTitleChange}
                placeholder="What's the task title"
              />
            </div>
            <div className="todo-input-item">
              <label htmlFor="Description">Description</label>
              <input
                type="text"
                name="Description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="What's the task description"
                onKeyDown={handleKeyPress}
              />
            </div>
            <div className="todo-input-item">
              <button
                type="button"
                className="primary-button"
                onClick={handleAddTodo}
              >
                Add
              </button>
            </div>
          </div>
          <div className="btn-area">
            <button
              className={`secondary-button ${
                isCompleted === false && "active"
              }`}
              onClick={() => setIsCompleted(false)}
            >
              Todo
            </button>
            <button
              className={`secondary-button ${isCompleted === true && "active"}`}
              onClick={() => setIsCompleted(true)}
            >
              Completed
            </button>
          </div>
          <div className="todo-list">
            {isCompleted === false &&
              todos.todos.map((todo, index) => {
                if (editItem === index) {
                  return (
                    <div className="edit-todo" key={index}>
                      <input
                        placeholder="Update Title"
                        type="text"
                        value={currentEditedTodo?.title}
                        onChange={(e) => handleUpdateTitle(e.target.value)}
                      />
                      <textarea
                        placeholder="Update Description"
                        value={currentEditedTodo?.description}
                        rows={4}
                        onChange={(e) =>
                          handleUpdateDescription(e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={handleUpdateTodo}
                        className="primary-button"
                      >
                        Update
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div className="todo-list-item" key={index}>
                      <div className="todo-item-content">
                        <h3>{todo.title}</h3>
                        <p>{todo.description}</p>
                      </div>
                      <div>
                        <AiOutlineDelete
                          className="delete-icon"
                          title="Delete?"
                          onClick={() => handleDeleteTodo(index)}
                        />
                        <AiOutlineEdit
                          className="edit-icon"
                          onClick={() => handleEdit(index, todo)}
                          title="Edit?"
                        />
                        <BsCheckLg
                          className="check-icon"
                          title="Complete?"
                          onClick={() => handleComplete(index)}
                        />
                      </div>
                    </div>
                  );
                }
              })}
            {isCompleted === true &&
              completedTodos.map((todo, index) => (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{todo.title}</h3>
                    <p>{todo.description}</p>
                    <p className="completed-date">
                      Completed at: {todo.completedDate}
                    </p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      className="delete-icon"
                      title="Delete"
                      onClick={() => handleDeleteCompletedTodo(index)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
