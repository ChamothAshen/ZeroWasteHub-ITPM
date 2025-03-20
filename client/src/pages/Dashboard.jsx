import ProfileSidebar from '../components/ProfileSidebar';
import { useSelector} from 'react-redux';
function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  
  return (
    <div className="flex">
      <ProfileSidebar currentUser={currentUser} />
      <div className="flex-1 p-6">
        {/* Your main dashboard content goes here */}
      </div>
    </div>
  );
}
export default Dashboard;