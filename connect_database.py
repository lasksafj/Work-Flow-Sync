import tkinter as tk
from pymongo import MongoClient, errors

def init_db():
    global users
    password: str = "Abc123"
    username: str = "garaco"
    project: str = "cluster0"
    hash_name: str = "n3g7811"
    cluster = f"mongodb+srv://{username}:{password}@{project}.{hash_name}.mongodb.net/"
    client = MongoClient(cluster)
    db = client["WorkflowSync"]
    users = db["users"]

    users_indexes = users.index_information()
    if 'users_name' in users_indexes:
        print("Name index present.")
    else:
        users.create_index([('name', 1)], unique=True, name="users_name")

def submit_data():
    user_name = entry.get()
    try:
        if user_name:
            users.insert_one({'name': user_name})
            label.config(text="Data saved!")
            entry.delete(0, tk.END)
        else:
            label.config(text="Please enter a name")
    except errors.DuplicateKeyError:
        label.config(text="This name already exists. Try another name.")

def delete_all_data():
    result = users.delete_many({})
    if result.deleted_count > 0:
        label.config(text=f"Deleted {result.deleted_count} records.")
    else:
        label.config(text="No records to delete.")
    text_area.delete('1.0', tk.END)

def retrieve_data():
    try:
        user_data = users.find()
        text_area.delete('1.0', tk.END)
        for user in user_data:
            text_area.insert(tk.END, user['name'] + '\n')
    except Exception as e:
        label.config(text="Failed to load data.")
        print(e)

app = tk.Tk()
app.title("Insert to database")
app.geometry('400x400')

entry = tk.Entry(app, font=('Arial', 14))
entry.pack(pady=10)

button = tk.Button(app, text="Submit", command=submit_data)
button.pack(pady=5)

load_button = tk.Button(app, text="Refresh", command=retrieve_data)
load_button.pack(pady=5)

label = tk.Label(app, text="", font=('Arial', 14))
label.pack(pady=10)

delete_button = tk.Button(app, text="Delete All", command=delete_all_data)
delete_button.pack(pady=5)

text_area = tk.Text(app, height=10, width=50)
text_area.pack(pady=10)

init_db()

app.mainloop()
