import React, { useParams } from 'react-router';
import StationInfo from '../../../../components/StationInfo';

const EvaluatorSetup = ({ isAdmin }) => {
  // TODO: get info from DB
  const pageData = [{
    role: 'evaluator',
    info: 'setup',
    packetID: 0,
    content: 'evaluator setup text',
  },
  {
    role: 'evaluator',
    info: 'setup',
    packetID: 1,
    content: 'some more text',
  }];
  const params = useParams();
  return <StationInfo id={params.id} pageData={pageData} isAdmin={isAdmin} />;
};

export default EvaluatorSetup;
