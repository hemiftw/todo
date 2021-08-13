import React, { useEffect, useState, useRef } from "react";
import "./style.scss";
import { Input } from "../../components/form";
function TreeView(props) {
  const [tasks, setTasks] = useState([]);
  const [firstLoad, setLoad] = useState(true);

  const [editTarget, setEditTarget] = useState({ mode: false, id: 0 });
  let inputref = useRef(null);

  useEffect(() => {
    if (editTarget.mode === true && editTarget.id !== 0) {
      inputref.current.focus();
    }
    if (firstLoad) {
      const storage = localStorage.getItem("tasks");
      if (storage) {
        const parsedTasks = JSON.parse(storage);
        setLoad(false);
        setTasks(parsedTasks);
      } else {
        localStorage.setItem("tasks", "[]");
      }
    } else {
      const stringified = JSON.stringify(tasks);
      localStorage.setItem("tasks", stringified);
    }
  }, [editTarget, tasks]);
  const addItem = (parentId) => {
    const randomNumber = Math.floor(Math.random() * 10000) + 1;
    const task = {
      title: parentId === 0 ? "New Task" : "New Sub Task",
      id: randomNumber,
      parentId: parentId,
    };
    setTasks([...tasks, task]);
  };

  const modifyTask = (task) => {
    setEditTarget({ mode: true, id: task.id });
  };

  const editTask = (value, task) => {
    tasks[tasks.indexOf(task)].title = value;
    setTasks(tasks);
    setEditTarget({ mode: false, id: 0 });
  };

  const detectKey = (event, task) => {
    if (event.key === "Delete" && event.shiftKey && event.ctrlKey) {
      event.preventDefault();
      handleRemove(task.id);
    }
    if (event.key === "Enter" && task.parentId === 0) {
      addItem(task.id);
    }
    if (event.key === "Tab" || (event.key === "Tab" && event.shiftKey)) {
      event.preventDefault();
      switchItems(task);
    }
  };
  const switchItems = (task) => {
    let taskList = [];
    let targetTask = {};
    if (task.parentId !== 0) {
      taskList = tasks.filter((tsk) => tsk.parentId === task.parentId);
      targetTask = taskList[taskList.indexOf(task) + 1];
    } else {
      taskList = tasks.filter((tsk) => tsk.parentId === 0);
      targetTask = taskList[taskList.indexOf(task) + 1];
    }
    if (targetTask) {
      modifyTask(targetTask);
    } else {
      modifyTask(taskList[0]);
    }
  };
  const handleRemove = (id) => {
    let newTasks = tasks
      .filter((task) => task.id !== id)
      .filter((task) => task.parentId !== id);
    setEditTarget({ id: 0, mode: false });
    setTasks(newTasks);
  };

  return (
    <div className="tree__container">
      <div className="tree__list" id="treeList">
        <ul className="list__container">
          {tasks
            .filter((task) => task.parentId === 0)
            .map((task) => (
              <li key={task.id} onClick={() => modifyTask(task)}>
                {editTarget.mode === true && editTarget.id === task.id ? (
                  <Input
                    defaultValue={task.title}
                    onKeyDown={(e) => detectKey(e, task)}
                    onBlur={(e) => editTask(e.target.value, task)}
                    ownref={inputref}
                  />
                ) : (
                  task.title
                )}
                <ul>
                  {tasks
                    .filter((tsk) => tsk.parentId === task.id)
                    .map((tsk) => (
                      <li
                        key={tsk.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          modifyTask(tsk);
                        }}
                      >
                        {editTarget.mode === true &&
                        editTarget.id === tsk.id ? (
                          <Input
                            defaultValue={tsk.title}
                            onKeyDown={(e) => detectKey(e, tsk)}
                            onBlur={(e) => editTask(e.target.value, tsk)}
                            ownref={inputref}
                          />
                        ) : (
                          tsk.title
                        )}
                      </li>
                    ))}
                </ul>
              </li>
            ))}
        </ul>
      </div>
      <div className="plus__icon" onClick={() => addItem(0)}>
        +
      </div>
    </div>
  );
}

export default TreeView;
