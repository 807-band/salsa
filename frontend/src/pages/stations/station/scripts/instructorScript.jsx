import { useParams } from 'react-router';
import StationInfo from '../../../../components/StationInfo';

const InstructorScript = ({ isAdmin }) => {
  // TODO: get info from DB
  const pageData = [{
    role: 'instructor',
    info: 'script',
    packetID: 0,
    content: "instructor script text",
  },
  {
    role: 'instructor',
    info: 'script',
    packetID: 1,
    content: "some more text",
  }];
  const params = useParams();
  return <StationInfo id={params.id} pageData={pageData} isAdmin={isAdmin}/>;
}

export default InstructorScript;