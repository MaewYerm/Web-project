-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema project_web
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema project_web
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `project_web` DEFAULT CHARACTER SET utf8 ;
USE `project_web` ;

-- -----------------------------------------------------
-- Table `project_web`.`Role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_web`.`Role` (
  `role_id` INT NOT NULL,
  `role_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`role_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project_web`.`Gender`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_web`.`Gender` (
  `gender_id` INT NOT NULL,
  `gender_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`gender_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project_web`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_web`.`User` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `firstname` VARCHAR(45) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `birthday` DATE NOT NULL,
  `address` VARCHAR(100) NOT NULL,
  `nation` VARCHAR(45) NOT NULL,
  `tel_main` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `tel_sub` VARCHAR(45) NULL DEFAULT NULL,
  `profile_pic` BLOB NULL DEFAULT NULL,
  `role_id` INT NOT NULL,
  `gender_id` INT NOT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `fk_User_Role1_idx` (`role_id` ASC) VISIBLE,
  INDEX `fk_User_Gender1_idx` (`gender_id` ASC) VISIBLE,
  CONSTRAINT `fk_User_Role1`
    FOREIGN KEY (`role_id`)
    REFERENCES `project_web`.`Role` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_Gender1`
    FOREIGN KEY (`gender_id`)
    REFERENCES `project_web`.`Gender` (`gender_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project_web`.`audit_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_web`.`audit_log` (
  `audit_id (PK)` INT NOT NULL AUTO_INCREMENT,
  `table_name` VARCHAR(45) NOT NULL,
  `record_id` VARCHAR(45) NOT NULL,
  `action_type` VARCHAR(45) NOT NULL,
  `old_value` VARCHAR(45) NOT NULL,
  `new_value` VARCHAR(45) NOT NULL,
  `action_time` TIMESTAMP NOT NULL,
  `User_user_id` INT NOT NULL,
  PRIMARY KEY (`audit_id (PK)`),
  INDEX `fk_audit_log_User1_idx` (`User_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_audit_log_User1`
    FOREIGN KEY (`User_user_id`)
    REFERENCES `project_web`.`User` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project_web`.`beef_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_web`.`beef_type` (
  `beef_type_id` INT NOT NULL,
  `type_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`beef_type_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project_web`.`Grade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_web`.`Grade` (
  `grade_id` INT NOT NULL,
  `grade_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`grade_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project_web`.`Owner`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_web`.`Owner` (
  `owner_id` INT NOT NULL AUTO_INCREMENT,
  `owner_name` VARCHAR(45) NOT NULL,
  `owner_tel` VARCHAR(45) NOT NULL,
  `owner_coop_id` VARCHAR(45) NOT NULL,
  `owner_email` VARCHAR(45) NULL DEFAULT NULL,
  `owner_lineid` VARCHAR(45) NULL DEFAULT NULL,
  `owner_facebook` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`owner_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project_web`.`storage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_web`.`storage` (
  `storage_id` INT NOT NULL,
  `storage_name` VARCHAR(45) NOT NULL,
  `capacity` FLOAT NOT NULL,
  `temperature` FLOAT NOT NULL,
  `storage_type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`storage_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `project_web`.`Beef_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `project_web`.`Beef_info` (
  `beef_id` INT NOT NULL AUTO_INCREMENT,
  `lot_id` VARCHAR(45) NOT NULL,
  `qty` INT NOT NULL,
  `weight` FLOAT NOT NULL,
  `recieve_date` DATE NOT NULL,
  `expired_date` DATE NOT NULL,
  `aging` INT NOT NULL,
  `beef_type_id` INT NOT NULL,
  `grade_id` INT NOT NULL,
  `Owner_owner_id` INT NOT NULL,
  `storage_id` INT NOT NULL,
  PRIMARY KEY (`beef_id`),
  INDEX `fk_Beef_info_beef_type1_idx` (`beef_type_id` ASC) VISIBLE,
  INDEX `fk_Beef_info_Grade1_idx` (`grade_id` ASC) VISIBLE,
  INDEX `fk_Beef_info_Owner1_idx` (`Owner_owner_id` ASC) VISIBLE,
  INDEX `fk_Beef_info_storage1_idx` (`storage_id` ASC) VISIBLE,
  CONSTRAINT `fk_Beef_info_beef_type1`
    FOREIGN KEY (`beef_type_id`)
    REFERENCES `project_web`.`beef_type` (`beef_type_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Beef_info_Grade1`
    FOREIGN KEY (`grade_id`)
    REFERENCES `project_web`.`Grade` (`grade_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Beef_info_Owner1`
    FOREIGN KEY (`Owner_owner_id`)
    REFERENCES `project_web`.`Owner` (`owner_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Beef_info_storage1`
    FOREIGN KEY (`storage_id`)
    REFERENCES `project_web`.`storage` (`storage_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
