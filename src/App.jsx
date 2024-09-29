import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Firebase Firestore instance
import Heatmap from './Heatmap';

const App = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all'); // Activity filter

  useEffect(() => {
    const fetchData = async () => {
      let q;
      const contributionsRef = collection(db, 'contributions');

      if (filter === 'all') {
        // No filter, fetch all data
        q = query(contributionsRef);
      } else {
        // Apply filter (e.g., filter for 'run' or 'reading')
        q = query(contributionsRef, where('activity', '==', filter));
      }

      const querySnapshot = await getDocs(q);
      const filteredData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setData(filteredData);
    };

    fetchData();
  }, [filter]);

  return (
    <div>
      <h2>Filter by Activity</h2>

      {/* Buttons or dropdown to change the filter */}
      <button onClick={() => setFilter('all')}>All</button>
      <button onClick={() => setFilter('run')}>Running</button>
      <button onClick={() => setFilter('reading')}>Reading</button>

      {/* Your CalendarHeatmap component using filtered data */}
      <Heatmap data={data} />
    </div>
  );
};

export default App;
