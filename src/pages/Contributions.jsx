import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../firebase'; // Firebase Firestore instance
import Heatmap from '../components/Heatmap';

const Contributions = () => {
  const [filter, setFilter] = useState('all'); // Activity filter

  // Fetch data based on the filter
  const fetchData = async () => {
    const contributionsRef = collection(db, 'contributions');
    let q;

    // Apply query conditionally based on the filter
    if (filter === 'all') {
      q = query(contributionsRef); // Fetch all documents
    } else {
      q = query(contributionsRef, where('activity', '==', filter)); // Fetch filtered documents
    }

    // Fetch the data from Firestore
    const querySnapshot = await getDocs(q);

    // Map the data to a more usable format
    const filteredData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return filteredData;
  };

  const { data} = useQuery({
    queryKey: ['contributions', filter], 
    queryFn: fetchData, 
  });

  return (
    <div>
      <h2>Filter by Activity</h2>

      {/* Buttons or dropdown to change the filter */}
      <button onClick={() => setFilter('all')}>All</button>
      <button onClick={() => setFilter('run')}>Running</button>
      <button onClick={() => setFilter('reading')}>Reading</button>

      {/* Pass the data to the Heatmap component */}
      <Heatmap data={data || []} />
    </div>
  );
};

export default Contributions;
