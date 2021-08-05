import { useEffect, useState } from 'react';
import React, { useParams } from 'react-router';
import StationInfo from '../../../../components/StationInfo';
import { getInformation } from '../../../../lib/stations';

const InstructorScript = ({ isAdmin }) => {
  const [pageData, setPageData] = useState(null);
  const params = useParams();

  useEffect(() => {
    getInformation(params.id)
      .then((info) => setPageData(
        info.filter((i) => i.role === 'instructor' && i.info === 'script'),
      ));
  }, []);

  return pageData ? <StationInfo id={params.id} pageData={pageData} isAdmin={isAdmin} /> : null;
};

export default InstructorScript;
