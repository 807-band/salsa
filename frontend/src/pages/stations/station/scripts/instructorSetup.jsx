import React, { useParams } from 'react-router';
import StationInfo from '../../../../components/StationInfo';

const InstructorSetup = ({ isAdmin }) => {
  // TODO: get info from DB
  const pageData = [{
    role: 'instructor',
    info: 'setup',
    packetID: 0,
    content: 'instructor setup text',
  },
  {
    role: 'instructor',
    info: 'setup',
    packetID: 1,
    content: 'some more text',
  }];
  const params = useParams();
  return <StationInfo id={params.id} pageData={pageData} isAdmin={isAdmin} />;
};

export default InstructorSetup;
