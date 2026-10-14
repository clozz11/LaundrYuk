CREATE DATABASE IF NOT EXISTS laundryyuk
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE laundryyuk;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY users_username_unique (username),
    UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS harga (
    id_harga INT UNSIGNED NOT NULL,
    jenis_layanan VARCHAR(100) NOT NULL,
    harga DECIMAL(12, 2) NOT NULL,
    satuan VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_harga)
) ENGINE=InnoDB;

INSERT INTO harga (id_harga, jenis_layanan, harga, satuan) VALUES
    (1, 'Cuci Reguler', 5000, 'kg'),
    (2, 'Cuci Express', 8000, 'kg'),
    (3, 'Setrika Saja', 3000, 'kg'),
    (4, 'Cuci + Setrika', 7000, 'kg'),
    (5, 'Dry Clean Jas', 25000, 'piece'),
    (6, 'Dry Clean Gaun', 35000, 'piece'),
    (7, 'Cuci Bedcover', 15000, 'piece'),
    (8, 'Cuci Sepatu', 20000, 'piece'),
    (9, 'Cuci Karpet', 50000, 'set'),
    (10, 'Cuci Boneka', 10000, 'piece')
ON DUPLICATE KEY UPDATE
    jenis_layanan = VALUES(jenis_layanan),
    harga = VALUES(harga),
    satuan = VALUES(satuan);

CREATE TABLE IF NOT EXISTS laundry (
    id_laundry INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    id_harga INT UNSIGNED NOT NULL,
    id_slot INT UNSIGNED NOT NULL DEFAULT 1,
    total_berat DECIMAL(8, 2) NOT NULL,
    total_harga DECIMAL(12, 2) NOT NULL,
    alamat_order TEXT NOT NULL,
    nomor_telepon VARCHAR(30) NULL,
    status ENUM('pending', 'on_progress', 'ready_for_pickup', 'completed', 'cancelled')
        NOT NULL DEFAULT 'pending',
    tanggal_order DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_laundry),
    KEY laundry_user_status_index (user_id, status),
    KEY laundry_harga_index (id_harga),
    CONSTRAINT laundry_user_fk FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT laundry_harga_fk FOREIGN KEY (id_harga) REFERENCES harga (id_harga)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS detail_laundry (
    id_detail INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_laundry INT UNSIGNED NOT NULL,
    id_harga INT UNSIGNED NOT NULL,
    jumlah DECIMAL(8, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    PRIMARY KEY (id_detail),
    KEY detail_laundry_harga_index (id_harga),
    CONSTRAINT detail_laundry_order_fk FOREIGN KEY (id_laundry)
        REFERENCES laundry (id_laundry) ON DELETE CASCADE,
    CONSTRAINT detail_laundry_harga_fk FOREIGN KEY (id_harga) REFERENCES harga (id_harga)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS feedback (
    id_feedback INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_laundry INT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    komentar TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_feedback),
    UNIQUE KEY feedback_laundry_unique (id_laundry),
    CONSTRAINT feedback_laundry_fk FOREIGN KEY (id_laundry)
        REFERENCES laundry (id_laundry) ON DELETE CASCADE,
    CONSTRAINT feedback_rating_check CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

DROP PROCEDURE IF EXISTS sp_update_status;
DELIMITER //
CREATE PROCEDURE sp_update_status(IN p_order_id INT UNSIGNED, IN p_status VARCHAR(30))
BEGIN
    UPDATE laundry
    SET status = p_status
    WHERE id_laundry = p_order_id;
END //
DELIMITER ;
