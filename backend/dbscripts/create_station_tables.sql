CREATE TABLE Station (
  sID INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(60) NOT NULL,
  description VARCHAR(300),
  maxFailed INT DEFAULT 0,
  level INT,
  class INT
);

CREATE TABLE StationGroup (
  groupID INT AUTO_INCREMENT PRIMARY KEY,
  stationID INT NOT NULL,
  title VARCHAR(60),
  level INT,

  FOREIGN KEY (stationID) REFERENCES Station (sID)
);

CREATE TABLE StationItem (
  itemID INT AUTO_INCREMENT PRIMARY KEY,
  groupID INT NOT NULL,
  item VARCHAR(90),
  level INT,
  required BOOLEAN,

  FOREIGN KEY (groupID) REFERENCES StationGroup (groupID)
);

CREATE TABLE StationPacket(
  packetID INT AUTO_INCREMENT PRIMARY KEY,
  stationID INT NOT NULL,
  role VARCHAR(20),
  info VARCHAR(20),
  content VARCHAR(4000),
  level INT,

  FOREIGN KEY (stationID) REFERENCES Station (sID)
);

-- backwards compatible updates
ALTER TABLE StationGroup DROP FOREIGN KEY stationgroup_ibfk_1;
ALTER TABLE StationItem DROP FOREIGN KEY stationitem_ibfk_1;
ALTER TABLE StationPacket DROP FOREIGN KEY stationpacket_ibfk_1;

ALTER TABLE StationGroup ADD CONSTRAINT FK_Station
  FOREIGN KEY (stationID) REFERENCES Station (sID) ON DELETE CASCADE;

ALTER TABLE StationItem ADD CONSTRAINT FK_StationGroup
  FOREIGN KEY (groupID) REFERENCES StationGroup (groupID) ON DELETE CASCADE;

ALTER TABLE StationPacket ADD CONSTRAINT FK_sID_packet
  FOREIGN KEY (stationID) REFERENCES Station (sID) ON DELETE CASCADE;
