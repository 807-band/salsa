import React, { useParams } from 'react-router';
import StationInfo from '../../../../components/StationInfo';

const EvaluatorScript = ({ isAdmin }) => {
  // TODO: get info from DB
  const pageData = [{
    role: 'evaluator',
    info: 'script',
    packetID: 0,
    content: 'evaluator script text',
  },
  {
    role: 'evaluator',
    info: 'script',
    packetID: 1,
    content: 'some more text',
  }];
  const params = useParams();
  return <StationInfo id={params.id} pageData={pageData} isAdmin={isAdmin} />;
};

export default EvaluatorScript;
