DELIMITER $$
/* set level to next available one */
CREATE TRIGGER station_level BEFORE INSERT ON Station
FOR EACH ROW
BEGIN
  SET NEW.level = (SELECT COUNT(sID) FROM Station WHERE `class`=NEW.class);
END $$

CREATE TRIGGER group_level BEFORE INSERT ON StationGroup
FOR EACH ROW
BEGIN
  SET NEW.level = (SELECT COUNT(groupID) FROM StationGroup WHERE stationID=NEW.stationID);
END $$

CREATE TRIGGER item_level BEFORE INSERT ON StationItem
FOR EACH ROW
BEGIN
  SET NEW.level = (SELECT COUNT(itemID) FROM StationItem WHERE groupID=NEW.groupID);
END $$

/* auto create item an groupings */
CREATE TRIGGER auto_create_group AFTER INSERT ON Station
FOR EACH ROW
BEGIN
  INSERT INTO StationGroup (stationID, title) VALUES (NEW.sID, 'example grouping');
END $$

CREATE TRIGGER auto_create_item AFTER INSERT ON StationGroup
FOR EACH ROW
BEGIN
  INSERT INTO StationItem (groupID, item) VALUES (NEW.groupID, 'example item');
END $$

/* create default instructor/evaluator script/setup */
CREATE TRIGGER auto_create_packet AFTER INSERT ON Station
FOR EACH ROW
BEGIN
   INSERT INTO StationPacket (stationID, role, info, content) VALUES (NEW.sID, 'instructor', 'setup', '');
   INSERT INTO StationPacket (stationID, role, info, content) VALUES (NEW.sID, 'instructor', 'script', '');
   INSERT INTO StationPacket (stationID, role, info, content) VALUES (NEW.sID, 'evaluator', 'setup', '');
   INSERT INTO StationPacket (stationID, role, info, content) VALUES (NEW.sID, 'evaluator', 'script', '');
END $$

CREATE TRIGGER packet_level BEFORE INSERT ON StationPacket
FOR EACH ROW
BEGIN
  SET NEW.level = (SELECT COUNT(packetID) FROM StationPacket WHERE stationID=NEW.stationID);
END $$

DELIMITER ;
