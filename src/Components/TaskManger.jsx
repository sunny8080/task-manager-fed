import React, { useEffect, useState } from 'react'
import Task from './Task';
const { VITE_BED_URL } = import.meta.env;

const TaskManger = () => {
  const [tasks, setTasks] = useState([]);
  const [curTask, setCurTask] = useState("");

  useEffect(() => {
    const fetchAllTasks = async () => {
      const res = await fetch(VITE_BED_URL + '/tasks');
      const data = await res.json();

      if (res.status) {
        setTasks(data?.data);
      }
    };
    fetchAllTasks();
  }, []);

  const handleAddTask = async () => {
    if (curTask.trim() == "") return;
    const cur = tasks;
    setTasks([...cur, { _id: "45", title: curTask.trim() }]);

    const res = await fetch(VITE_BED_URL + '/tasks', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: curTask.trim()
      })
    })

    const data = await res.json();

    if (res.status) {
      setTasks([...cur, data?.data]);
      setCurTask('');
    } else {
      setTasks([...cur]);
    }
  }

  const handleDeleteTask = async (taskId) => {
    setTasks(tasks.filter(task => task._id != taskId));

    await fetch(VITE_BED_URL + '/tasks', {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        taskId: taskId
      })
    });
  }

  return (
    <div className='border border-[#7ae582] rounded-md shadow py-2 px-3 mx-auto max-w-[800px]' >
      <h1 className='text-center text-3xl font-bold mt-2 mb-7 text-[#7ae582]'>Task Manager</h1>

      {/* input for creating a task */}
      <div>
        <input
          type="text"
          className='w-full rounded-md outline-none border px-2 py-1 text-gray-200'
          placeholder='Enter your task'
          value={curTask}
          onChange={(e) => setCurTask(e.target.value)}
        />

        <button
          type="button"
          className='ml-auto block mt-3 py-1 px-7 rounded-sm transition-all border border-[#7ae582] cursor-pointer text-gray-200 hover:text-black hover:bg-[#7ae582] disabled:text-gray-400'
          disabled={curTask.trim() == ""}
          onClick={handleAddTask}
        >Add Task</button>
      </div>

      {/* list of task */}

      <div className='my-5' >
        <h2 className='text-center text-2xl font-bold mt-2 mb-5 text-[#7ae582]' >All Task</h2>

        {
          tasks && tasks.length > 0 ?
            (
              <div className='flex flex-col gap-2' >
                {
                  tasks.map((task, ind) => {
                    return <Task task={task} handleDeleteTask={handleDeleteTask} key={ind} />
                  })
                }
              </div>
            )
            :
            (
              <div className='' >
                <p className='text-center text-gray-400' >No task found. Please add your pending task</p>
              </div>
            )
        }
      </div>

    </div>
  )
}

export default TaskManger