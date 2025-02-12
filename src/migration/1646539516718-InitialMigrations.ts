import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigrations1646699516718 implements MigrationInterface {
    name = 'InitialMigrations1646699516718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`file_generic\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_directory\` text NOT NULL, \`_nameFile\` text NOT NULL, \`_description\` text NULL, \`_type\` varchar(255) NOT NULL, \`Type_id\` int NULL, \`Horse_id\` int NULL, \`Intervention_id\` int NULL, INDEX \`IDX_d13ef0ecce50456fa5cb9a2560\` (\`_type\`), PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`value_list\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_key\` text NOT NULL, \`_value\` text NOT NULL, \`_order\` int NOT NULL, \`_filter\` tinyint NOT NULL DEFAULT 0, \`_description\` text NOT NULL, \`_deleted\` tinyint NOT NULL DEFAULT 0, \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_type\` varchar(255) NOT NULL, INDEX \`IDX_c548ec315918b160d82607c689\` (\`_type\`), PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_title\` text NOT NULL, \`_description\` text NOT NULL, \`_startDate\` datetime NOT NULL, \`_endDate\` datetime NOT NULL, \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_deleted\` tinyint NOT NULL DEFAULT 0, \`Type_id\` int NULL, \`Horse_id\` int NULL, \`CreatedTaskUser_id\` int NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`human\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_userManagerId\` bigint NOT NULL, \`_firstName\` text NOT NULL, \`_lastName\` text NOT NULL, \`_dni\` text NOT NULL, \`_email\` text NOT NULL, \`_registrationNumber\` text NULL, \`type\` varchar(255) NOT NULL, INDEX \`IDX_98729ed1563cfd7e2f7c3488a2\` (\`type\`), PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`location\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_name\` text NOT NULL, \`_address\` text NOT NULL, \`_phoneNumber\` text NOT NULL, \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_deleted\` tinyint NOT NULL DEFAULT 0, \`PersonCharge_id\` int NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tag\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_name\` text NOT NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`history_classification\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_date\` datetime NULL, \`_cycle\` bigint NOT NULL, \`_comment\` text NOT NULL, \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_deleted\` tinyint NOT NULL DEFAULT 0, \`ClasificationName_id\` int NULL, \`IdHorse_id\` int NULL, \`IdRelatedHorse_id\` int NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_title\` text NOT NULL, \`_author\` text NOT NULL, \`_subtitle\` text NOT NULL, \`_content\` text NOT NULL, \`_epigraph\` text NOT NULL, \`_slug\` text NOT NULL, \`_tags\` text NOT NULL, \`_postDate\` datetime NOT NULL, \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_deleted\` tinyint NOT NULL DEFAULT 0, \`Type_id\` int NULL, \`Status_id\` int NULL, \`Horse_id\` int NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`horse\` (\`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_deleted\` tinyint NOT NULL DEFAULT 0, \`_id\` int NOT NULL AUTO_INCREMENT, \`_name\` text NOT NULL, \`_dateOfBirth\` datetime NULL, \`_AAFEFataSheet\` text NULL, \`_observation\` text NULL, \`_pedigree\` text NULL, \`_stock\` int NOT NULL, \`_showInWeb\` tinyint NOT NULL DEFAULT 0, \`Location_id\` int NULL, \`Sex_id\` int NULL, \`Fur_id\` int NULL, \`Veterinarian_id\` int NULL, \`Father_id\` int NULL, \`Mother_id\` int NULL, \`Rider_id\` int NULL, \`ImageProfile_id\` int NULL, UNIQUE INDEX \`REL_d7814358c177a86e63a781d354\` (\`ImageProfile_id\`), PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`treatment\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_deleted\` tinyint NOT NULL DEFAULT 0, \`_name\` text NOT NULL, \`_info\` text NOT NULL, \`_startDate\` datetime NOT NULL, \`_endDate\` datetime NULL, \`Diagnosis_id\` int NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`interventions\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_deleted\` tinyint NOT NULL DEFAULT 0, \`_description\` text NOT NULL, \`Appointment_id\` int NULL, \`Type_id\` int NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task__related_task_users_human\` (\`task_id\` int NOT NULL, \`human_id\` int NOT NULL, INDEX \`IDX_15eb2d11653e6a64f97a3a453b\` (\`task_id\`), INDEX \`IDX_b5b7aa2a5606188f6ccac18231\` (\`human_id\`), PRIMARY KEY (\`task_id\`, \`human_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`file_generic__tags_tag\` (\`fileGeneric_id\` int NOT NULL, \`tag_id\` int NOT NULL, INDEX \`IDX_9355bec6a8d0aa5f2b6331b542\` (\`fileGeneric_id\`), INDEX \`IDX_8800705d54b47c1ce0475d50af\` (\`tag_id\`), PRIMARY KEY (\`fileGeneric_id\`, \`tag_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_documentation\` text NOT NULL, \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_deleted\` tinyint NOT NULL DEFAULT 0, \`Horse_id\` int NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`diagnosis\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_anamnesis\` text NOT NULL, \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_deleted\` tinyint NOT NULL DEFAULT 0, \`_name\` text NOT NULL, \`_description\` text NOT NULL, \`Appointment_id\` int NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointment\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`_deleted\` tinyint NOT NULL DEFAULT 0, \`_date\` datetime NOT NULL, \`_name\` text NOT NULL, \`_description\` text NOT NULL, \`Veterinarian_id\` int NULL, \`VeterinarianAssistant_id\` int NULL, \`Horse_id\` int NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_ea6e06757d645dcab2066b9f179\` FOREIGN KEY (\`Type_id\`) REFERENCES \`value_list\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_1b0bc0930fd5a8265a10576b135\` FOREIGN KEY (\`Horse_id\`) REFERENCES \`horse\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_7041b11c29a12e128d3e00092fd\` FOREIGN KEY (\`CreatedTaskUser_id\`) REFERENCES \`human\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`location\` ADD CONSTRAINT \`FK_30433cad01dcd10c8566419fd79\` FOREIGN KEY (\`PersonCharge_id\`) REFERENCES \`human\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD CONSTRAINT \`FK_d51876d0350a174fc75cd7f538c\` FOREIGN KEY (\`Type_id\`) REFERENCES \`value_list\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD CONSTRAINT \`FK_0466e189f760040dc51f7206731\` FOREIGN KEY (\`Horse_id\`) REFERENCES \`horse\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD CONSTRAINT \`FK_7b6986fc77308c14799eb4f07fc\` FOREIGN KEY (\`Intervention_id\`) REFERENCES \`interventions\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_dfb0317aa6cb774868338d135db\` FOREIGN KEY (\`Horse_id\`) REFERENCES \`horse\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`history_classification\` ADD CONSTRAINT \`FK_e34ee653223752a0c5ff9a902bf\` FOREIGN KEY (\`ClasificationName_id\`) REFERENCES \`value_list\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`history_classification\` ADD CONSTRAINT \`FK_8e6fe80854a0c1257afae32709e\` FOREIGN KEY (\`IdHorse_id\`) REFERENCES \`horse\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`history_classification\` ADD CONSTRAINT \`FK_452580a2db5ef0724ab6b6b101e\` FOREIGN KEY (\`IdRelatedHorse_id\`) REFERENCES \`horse\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_e3a6d01ef7df50b2aefae9dbac1\` FOREIGN KEY (\`Type_id\`) REFERENCES \`value_list\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_9874e949ef4168daddee87874ac\` FOREIGN KEY (\`Status_id\`) REFERENCES \`value_list\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_158a8e8a611431be210f4204bf3\` FOREIGN KEY (\`Horse_id\`) REFERENCES \`horse\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`horse\` ADD CONSTRAINT \`FK_21718998f17567e43b3bdb4a40e\` FOREIGN KEY (\`Location_id\`) REFERENCES \`location\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`horse\` ADD CONSTRAINT \`FK_db6de0425a74f51dd27ae383e27\` FOREIGN KEY (\`Sex_id\`) REFERENCES \`value_list\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`horse\` ADD CONSTRAINT \`FK_8df0ccbaeb5458a688baf37b818\` FOREIGN KEY (\`Fur_id\`) REFERENCES \`value_list\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`horse\` ADD CONSTRAINT \`FK_be603b6a67ed20adc963e29fbfb\` FOREIGN KEY (\`Veterinarian_id\`) REFERENCES \`human\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`horse\` ADD CONSTRAINT \`FK_1dd33d9131baa55fd1a4d4ba23f\` FOREIGN KEY (\`Father_id\`) REFERENCES \`horse\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`horse\` ADD CONSTRAINT \`FK_29610790cc245bd85ea8efe3846\` FOREIGN KEY (\`Mother_id\`) REFERENCES \`horse\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`horse\` ADD CONSTRAINT \`FK_fadd0cdaab4c03cbb8013235178\` FOREIGN KEY (\`Rider_id\`) REFERENCES \`human\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`horse\` ADD CONSTRAINT \`FK_d7814358c177a86e63a781d3547\` FOREIGN KEY (\`ImageProfile_id\`) REFERENCES \`file_generic\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`treatment\` ADD CONSTRAINT \`FK_69ab74d058f9a620af21cf7b433\` FOREIGN KEY (\`Diagnosis_id\`) REFERENCES \`diagnosis\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`diagnosis\` ADD CONSTRAINT \`FK_18300e9fb3fd8abf9cd34720b62\` FOREIGN KEY (\`Appointment_id\`) REFERENCES \`appointment\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`interventions\` ADD CONSTRAINT \`FK_d722ab9a682ad4aa1e329d0891b\` FOREIGN KEY (\`Appointment_id\`) REFERENCES \`appointment\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`interventions\` ADD CONSTRAINT \`FK_e5583bec25c84abf4dfeb22aa9e\` FOREIGN KEY (\`Type_id\`) REFERENCES \`value_list\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_a86daa926dc04f50aa4adfeca20\` FOREIGN KEY (\`Veterinarian_id\`) REFERENCES \`human\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_1843ae7d07b386f65637723e087\` FOREIGN KEY (\`VeterinarianAssistant_id\`) REFERENCES \`human\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_21d562c1d4a33780defebd1880d\` FOREIGN KEY (\`Horse_id\`) REFERENCES \`horse\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task__related_task_users_human\` ADD CONSTRAINT \`FK_15eb2d11653e6a64f97a3a453b5\` FOREIGN KEY (\`task_id\`) REFERENCES \`task\`(\`_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`task__related_task_users_human\` ADD CONSTRAINT \`FK_b5b7aa2a5606188f6ccac182312\` FOREIGN KEY (\`human_id\`) REFERENCES \`human\`(\`_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`file_generic__tags_tag\` ADD CONSTRAINT \`FK_9355bec6a8d0aa5f2b6331b5429\` FOREIGN KEY (\`fileGeneric_id\`) REFERENCES \`file_generic\`(\`_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`file_generic__tags_tag\` ADD CONSTRAINT \`FK_8800705d54b47c1ce0475d50afe\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic__tags_tag\` DROP FOREIGN KEY \`FK_8800705d54b47c1ce0475d50afe\``);
        await queryRunner.query(`ALTER TABLE \`file_generic__tags_tag\` DROP FOREIGN KEY \`FK_9355bec6a8d0aa5f2b6331b5429\``);
        await queryRunner.query(`ALTER TABLE \`task__related_task_users_human\` DROP FOREIGN KEY \`FK_b5b7aa2a5606188f6ccac182312\``);
        await queryRunner.query(`ALTER TABLE \`task__related_task_users_human\` DROP FOREIGN KEY \`FK_15eb2d11653e6a64f97a3a453b5\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_21d562c1d4a33780defebd1880d\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_1843ae7d07b386f65637723e087\``);
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_a86daa926dc04f50aa4adfeca20\``);
        await queryRunner.query(`ALTER TABLE \`interventions\` DROP FOREIGN KEY \`FK_e5583bec25c84abf4dfeb22aa9e\``);
        await queryRunner.query(`ALTER TABLE \`interventions\` DROP FOREIGN KEY \`FK_d722ab9a682ad4aa1e329d0891b\``);
        await queryRunner.query(`ALTER TABLE \`diagnosis\` DROP FOREIGN KEY \`FK_18300e9fb3fd8abf9cd34720b62\``);
        await queryRunner.query(`ALTER TABLE \`treatment\` DROP FOREIGN KEY \`FK_69ab74d058f9a620af21cf7b433\``);
        await queryRunner.query(`ALTER TABLE \`horse\` DROP FOREIGN KEY \`FK_d7814358c177a86e63a781d3547\``);
        await queryRunner.query(`ALTER TABLE \`horse\` DROP FOREIGN KEY \`FK_fadd0cdaab4c03cbb8013235178\``);
        await queryRunner.query(`ALTER TABLE \`horse\` DROP FOREIGN KEY \`FK_29610790cc245bd85ea8efe3846\``);
        await queryRunner.query(`ALTER TABLE \`horse\` DROP FOREIGN KEY \`FK_1dd33d9131baa55fd1a4d4ba23f\``);
        await queryRunner.query(`ALTER TABLE \`horse\` DROP FOREIGN KEY \`FK_be603b6a67ed20adc963e29fbfb\``);
        await queryRunner.query(`ALTER TABLE \`horse\` DROP FOREIGN KEY \`FK_8df0ccbaeb5458a688baf37b818\``);
        await queryRunner.query(`ALTER TABLE \`horse\` DROP FOREIGN KEY \`FK_db6de0425a74f51dd27ae383e27\``);
        await queryRunner.query(`ALTER TABLE \`horse\` DROP FOREIGN KEY \`FK_21718998f17567e43b3bdb4a40e\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_158a8e8a611431be210f4204bf3\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_9874e949ef4168daddee87874ac\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_e3a6d01ef7df50b2aefae9dbac1\``);
        await queryRunner.query(`ALTER TABLE \`history_classification\` DROP FOREIGN KEY \`FK_452580a2db5ef0724ab6b6b101e\``);
        await queryRunner.query(`ALTER TABLE \`history_classification\` DROP FOREIGN KEY \`FK_8e6fe80854a0c1257afae32709e\``);
        await queryRunner.query(`ALTER TABLE \`history_classification\` DROP FOREIGN KEY \`FK_e34ee653223752a0c5ff9a902bf\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_dfb0317aa6cb774868338d135db\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP FOREIGN KEY \`FK_7b6986fc77308c14799eb4f07fc\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP FOREIGN KEY \`FK_0466e189f760040dc51f7206731\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP FOREIGN KEY \`FK_d51876d0350a174fc75cd7f538c\``);
        await queryRunner.query(`ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_30433cad01dcd10c8566419fd79\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_7041b11c29a12e128d3e00092fd\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_1b0bc0930fd5a8265a10576b135\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_ea6e06757d645dcab2066b9f179\``);
        await queryRunner.query(`DROP INDEX \`IDX_b5b7aa2a5606188f6ccac18231\` ON \`task__related_task_users_human\``);
        await queryRunner.query(`DROP INDEX \`IDX_15eb2d11653e6a64f97a3a453b\` ON \`task__related_task_users_human\``);
        await queryRunner.query(`DROP TABLE \`task__related_task_users_human\``);
        await queryRunner.query(`DROP TABLE \`interventions\``);
        await queryRunner.query(`DROP TABLE \`treatment\``);
        await queryRunner.query(`DROP INDEX \`REL_d7814358c177a86e63a781d354\` ON \`horse\``);
        await queryRunner.query(`DROP TABLE \`horse\``);
        await queryRunner.query(`DROP TABLE \`post\``);
        await queryRunner.query(`DROP TABLE \`history_classification\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
        await queryRunner.query(`DROP TABLE \`location\``);
        await queryRunner.query(`DROP INDEX \`IDX_98729ed1563cfd7e2f7c3488a2\` ON \`human\``);
        await queryRunner.query(`DROP TABLE \`human\``);
        await queryRunner.query(`DROP TABLE \`task\``);
        await queryRunner.query(`DROP INDEX \`IDX_c548ec315918b160d82607c689\` ON \`value_list\``);
        await queryRunner.query(`DROP TABLE \`value_list\``);
        await queryRunner.query(`DROP TABLE \`appointment\``);
        await queryRunner.query(`DROP TABLE \`diagnosis\``);
        await queryRunner.query(`DROP TABLE \`document\``);
    }

}
