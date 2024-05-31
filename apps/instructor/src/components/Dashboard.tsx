import EnrolledUsers from "./dashboard/EnrolledUsers"
import Courses from "./dashboard/Courses"

function Dashboard() {

  return (
    <div className="p-4 md:grid-cols-2 gap-4 grid">
        <div className="max-w-xl">
            <Courses />
        </div>
        <div className="max-w-xl">
            <EnrolledUsers/>
        </div>
    </div>
  )
}

export default Dashboard