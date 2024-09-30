import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase"; // Firebase Firestore instance
import Heatmap from "../components/Heatmap";

const Contributions = () => {
  const [filter, setFilter] = useState("all"); // Activity filter

  // Fetch data based on the filter
  const fetchData = async () => {
    const contributionsRef = collection(db, "allTasks");
    let q;
  
    // Apply query conditionally based on the filter
    if (filter === "all") {
      q = query(contributionsRef); // Fetch all documents
    } else {
      q = query(contributionsRef, where("task", "==", filter)); // Fetch filtered documents
    }
  
    // Fetch the data from Firestore
    const querySnapshot = await getDocs(q);
  
    // Map the data to a more usable format
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  
    // Format the dates correctly
    function formattedDate(data) {
      return data.flatMap((i) => {
        return i.dates
          .filter((date) => date.completed === true)
          .map((date) => ({
            date: date.date, // Keep the date as a string, it's acceptable
            count: 1, // Set count for each completed date
          }));
      });
    }
  
    return formattedDate(filteredData); // Return array of objects with date and count
  };

  const fetchAllTasks = async () => {
    const tasksRef = collection(db, "allTasks");
    const q = tasksRef;

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));// Return all tasks if no date is provided
  };
  const { data } = useQuery({
    queryKey: ["all-tasks", filter],
    queryFn: fetchData,
  });
  const { data:Tasks } = useQuery({
    queryKey: ["all-tasks-filter"],
    queryFn: fetchAllTasks,
  });
  console.log({Tasks})
  // console.log(data,'datadddd')
  return (
    <section>
      <h2>Filter by Activity</h2>
    {Tasks?.map((task,index)=>(

      <button key={index} onClick={() => setFilter(task?.task)}>{task?.task}</button>
    ))}

      {/* Pass the data to the Heatmap component */}
      <Heatmap data={data || []} />
    </section>
  );
};

export default Contributions;
