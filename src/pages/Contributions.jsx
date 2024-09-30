import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../firebase'; // Firebase Firestore instance
import Heatmap from '../components/Heatmap';

const Contributions = () => {
  const [filter, setFilter] = useState('all'); // Activity filter

  // Fetch data based on the filter
  const fetchData = async () => {
    const contributionsRef = collection(db, 'allTasks');
    let q;

    // Apply query conditionally based on the filter
    if (filter === 'all') {
      q = query(contributionsRef); // Fetch all documents
    } else {
      q = query(contributionsRef, where('task', '==', filter)); // Fetch filtered documents
    }

    // Fetch the data from Firestore
    const querySnapshot = await getDocs(q);

    // Map the data to a more usable format
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
console.log({filteredData})
function filterDate(data) {
  return data?.map((i) => {
    return {
      id: i.id,
      completed: i.completed,
      task: i?.task,
      dates: i.dates.map((i) => {
        return { date: i, count: 2 };
      }),
    };
  });
}
    return filterDate(filteredData);
  };

  const { data} = useQuery({
    queryKey: ['all-tasks', filter], 
    queryFn: fetchData, 
  });

  return (
    <section>
      <h2>Filter by Activity</h2>

      {/* Buttons or dropdown to change the filter */}
      <button onClick={() => setFilter('all')}>All</button>
      <button onClick={() => setFilter('ddd')}>Running</button>
      <button onClick={() => setFilter('reading')}>Reading</button>

      {/* Pass the data to the Heatmap component */}
      <Heatmap data={data || []} />
    </section>
  );
};

export default Contributions;
