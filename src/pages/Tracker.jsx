import Checkbox from "../common/Checkbox";

function Tracker() {
  const data = [
    { id: 1, title: "run", completed: true },
    { id: 2, title: "walk", completed: true },
    { id: 3, title: "swim", completed: false },
  ];
  return (
    <section>
      <h2>Track Your Progress</h2>

      <div className="container-tracker">
        {data?.map((task, index) => (
          <div
            className={`task  ${task?.completed && "active-task"}`}
            key={index}
          >
            <Checkbox completed={task?.completed} />
            <p className="title-task">{task?.title}</p>
          </div>
        ))}
        <p>redding</p>
      </div>
    </section>
  );
}

export default Tracker;
