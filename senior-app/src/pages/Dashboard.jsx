import ProfileCard from "../components/ProfileCard"
import EventsCard from "../components/EventsCard"
import QuickAccess from "../components/QuickAccess"
import "../styles/Dashboard.css"

function Dashboard() {
  return (
    <div className="container">
      <main className="main">
        {/* Patient Profile and Events Section */}
        <div className="top-grid">
          <ProfileCard />
          <EventsCard />
        </div>

        {/* Quick Access Section */}
        <QuickAccess />
      </main>
    </div>
  )
}

export default Dashboard
