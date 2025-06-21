import csv
with open('../../../Knowledge Base/questionnaire.csv', 'r') as f:
    # reader = csv.DictReader(f)
    # Create a CSV reader object, specifying the delimiter if needed
    csv_reader = csv.reader(f, delimiter=',')
    
    # Optionally, read the header row
    header = next(csv_reader)
    print(f"Header: {header}")

    # Iterate through each row in the CSV file
    for row in csv_reader:
        print(f"Row: {row}")
