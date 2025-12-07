-- Migration: Auto-calculate is_accurate based on plate comparison
-- Created: 2024-12-07

-- Create function to calculate is_accurate
CREATE OR REPLACE FUNCTION calculate_is_accurate()
RETURNS TRIGGER AS $$
BEGIN
  -- If both plates have values
  IF NEW.plate_wim IS NOT NULL AND NEW.plate_camera IS NOT NULL THEN
    -- Compare (case-insensitive, trim whitespace)
    IF UPPER(TRIM(NEW.plate_wim)) = UPPER(TRIM(NEW.plate_camera)) THEN
      NEW.is_accurate := TRUE;
    ELSE
      NEW.is_accurate := FALSE;
    END IF;
  ELSE
    -- Missing data → NULL (not yet inspected)
    NEW.is_accurate := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to table
DROP TRIGGER IF EXISTS set_is_accurate ON anpr_records;
CREATE TRIGGER set_is_accurate
  BEFORE INSERT OR UPDATE OF plate_wim, plate_camera
  ON anpr_records
  FOR EACH ROW
  EXECUTE FUNCTION calculate_is_accurate();

-- Update existing records
UPDATE anpr_records
SET plate_wim = plate_wim;