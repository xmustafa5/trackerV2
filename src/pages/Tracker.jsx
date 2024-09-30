import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    const q = date
      ? query(tasksRef, where("dates", "array-contains", date))
      : tasksRef; // No date filter if no date is selected

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
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
  const fetchAllTasksaaa = async (date) => {
    const tasksRef = collection(db, "allTasks");
    const q = tasksRef;

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  };
  const { data: allTasksWithoutFilter } = useQuery({
    queryKey: ["all-dtasks"],
    queryFn: fetchAllTasksaaa,
  });
  // Update task completion status in Firestore
  const updateTaskStatus = async ({ id, completed }) => {
    const taskRef = doc(db, "allTasks", id);
    await updateDoc(taskRef, { completed });
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
        completed: false,
        dates: [currentDate.toISOString().split("T")[0]],
      });
    }

    setNewTask("");
    queryClient.invalidateQueries({ queryKey: ["all-tasks"] });
  };

  const handleTaskClick = (task) => {
    mutation.mutate({ id: task.id, completed: !task.completed });
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
    console.log(
      task.dates.includes(selectedDate.toISOString().split("T")[0]),
      "ds"
    );
    if(!task.dates?.includes(selectedDate.toISOString().split("T")[0])){
      console.log("Updating task", task.task);
      await updateDoc(taskRef, {
        dates: [...task.dates, selectedDate.toISOString().split("T")[0]],
      });
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
        .filter((task) => !allTasks?.some((t) => t.task === task.task))
        .map((task) => task);
      console.log(missingDates);
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

      <div className="container-tracker">
        {allTasks?.map((task) => (
          <div
            className={`task ${task.completed ? "active-task" : ""}`}
            key={task.id}
          >
            <Checkbox
              completed={task.completed}
              onClick={() => handleTaskClick(task)}
            />
            <p className="title-task">{task.task}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Tracker;
