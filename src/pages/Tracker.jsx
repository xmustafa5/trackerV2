import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Checkbox from "../common/Checkbox";
import { db } from "../firebase";

function Tracker() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddTask, setIsOpenAddTask] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [newTask, setNewTask] = useState("");
  const queryClient = useQueryClient();
  // Extract date from searchParams
  useEffect(() => {
    const dateFromParams = searchParams.get("date");
    if (dateFromParams) {
      setSelectedDate(new Date(dateFromParams));
    }
  }, [searchParams]);

  // Fetch task data from Firestore based on the selected date
  const fetchAllTasks = async (date) => {
    const tasksRef = collection(db, "allTasks");
  
    // Fetch all tasks
    const querySnapshot = await getDocs(tasksRef);
    
    // Filter tasks based on whether the date exists in the array of objects
    const tasks = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  
    // If a date is provided, filter the tasks
    if (date) {
      return tasks.filter(task =>
        task.dates.some(dateObj => dateObj.date === date)
      );
    }
  
    return tasks; // Return all tasks if no date is provided
  };
  

  // Use the selected date from the query params to fetch tasks
  const {
    data: allTasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-tasks", selectedDate],
    queryFn: () =>
      fetchAllTasks(
        selectedDate ? selectedDate.toISOString().split("T")[0] : null
      ),
  });
  const fetchAllTasksaaa = async () => {
    const tasksRef = collection(db, "allTasks");
    const q = tasksRef;

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  };
  const { data: allTasksWithoutFilter } = useQuery({
    queryKey: ["all-task-with-filter"],
    queryFn: fetchAllTasksaaa,
  });
  // Update task completion status in Firestore
  const updateTaskStatus = async ({ id, date, completed }) => {
    const taskRef = doc(db, "allTasks", id);
    const taskSnapshot = await getDoc(taskRef);
    const prevDates = taskSnapshot.data().dates || [];

    // Create a new array to hold the updated dates
    const updatedDates = prevDates.map(dateEntry => {
        // Check if the current dateEntry's date matches the provided date
        if (dateEntry.date === date) {
            // If it matches, update the completed status
            return { ...dateEntry, completed };
        }
        // Otherwise, return the dateEntry as is
        return dateEntry;
    });

    // Update the document with the modified dates array
    await updateDoc(taskRef, { dates: updatedDates });
};




  const mutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
    },
  });

  // Add new task to Firestore
  const addAllTask = async () => {
    if (newTask.trim() === "") return;
    const tasksRef = collection(db, "allTasks");

    const existingTask = allTasks.find((task) => task.task === newTask);

    if (existingTask) {
      const taskRef = doc(db, "allTasks", existingTask.id);
      await updateDoc(taskRef, {
        dates: [...existingTask.dates, currentDate.toISOString().split("T")[0]],
      });
    } else {
      await addDoc(tasksRef, {
        task: newTask,
        completed: [],
        dates: [{date:selectedDate.toISOString().split("T")[0], completed:false}],
      });
    }

    setNewTask("");
    queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
    queryClient.invalidateQueries({ queryKey: ["all-task-with-filter"] });
  };

  const handleTaskClick = (id, date, completed) => {
    console.log(completed)
    mutation.mutate({ id: id, date:date, completed:!completed });
  };

  // Calendar functions
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day) => {
    const selected = new Date(year, month, day + 1);
    setSelectedDate(selected);
    const formattedDate = selected.toISOString().split("T")[0];
    setSearchParams({ date: formattedDate }); // Update query params
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  const updateTaskDates = async (task) => {
    const taskRef = doc(db, "allTasks", task.id);
    const formattedDate = selectedDate.toISOString().split("T")[0];
  
    // Check if the date object with the same date already exists
    const dateExists = task.dates?.some(dateObj => dateObj.date === formattedDate);
  
  
    if (!dateExists) {
      console.log("Updating task", task.task);
      await updateDoc(taskRef, {
        dates: [...task.dates, { date: formattedDate, completed: false }],
      });
    } else {
      console.log("Date already exists, not updating task", task.task);
    }
  };
  const { mutate } = useMutation({
    mutationFn: updateTaskDates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });
  useEffect(() => {
    const filteredTasksStringified = JSON.stringify(allTasks);
    const unfilteredTasksStringified = JSON.stringify(allTasksWithoutFilter);

    if (
      JSON.stringify(filteredTasksStringified) !==
      JSON.stringify(unfilteredTasksStringified)
    ) {
      const missingDates = allTasksWithoutFilter
        ?.filter((task) => !allTasks?.some((t) => t.task === task.task))
        .map((task) => task);
        console.log(missingDates)
      missingDates.forEach((date) => {
        mutate(date);
      });

      // Invalidate the query cache to force re-fetching
      queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
    }
  }, [allTasks, currentDate]);
 
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching tasks...</div>;
  return (
    <section>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Calendar</button>
      <button onClick={() => setIsOpenAddTask(!isOpenAddTask)}>Add Task</button>

      {isOpen && (
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={goToPreviousMonth}>{"<"}</button>
            <span>{`${year} - ${month + 1}`}</span>
            <button onClick={goToNextMonth}>{">"}</button>
          </div>

          <div className="calendar-body">
            <div className="calendar-days">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="calendar-day-name">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-dates">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    day ? "calendar-day-selectable" : ""
                  } ${
                    selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => day && handleDateClick(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isOpenAddTask && (
        <div className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter task..."
          />
          <button onClick={addAllTask}>Add Task</button>
        </div>
      )}

      <h2>Track Your Progress</h2>
{console.log(allTasks)}
      <div className="container-tracker">
        {allTasks?.map((task) => (
          <div
            className={`task ${task.completed ? "active-task" : ""}`}
            key={task.id}
          >
             {task?.dates?.map((item,index)=>(
item?.date === selectedDate.toISOString().split("T")[0] &&
              <Checkbox
              key={index}
              completed={item.completed}
              onClick={() => handleTaskClick(task?.id,item?.date,item?.completed)}
              />
            ))}
            <p className="title-task">{task.task}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Tracker;
