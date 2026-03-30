from flask import Flask, request, jsonify, render_template
from werkzeug.security import generate_password_hash
import mysql.connector
import os
from werkzeug.security import check_password_hash
from flask import session

app = Flask(__name__)

app.secret_key = "your_secret_key"

esi_loged_in = False

# ---- DATABASE CONFIG ----
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "Gramatalaba01020304.",
    "database": "majaslapa_1"
}

# ---- ROUTES ----

@app.route("/", methods=["GET"])
def home():
    return render_template("majaslapa_1.html",)
@app.route("/1", methods=["GET"])
def home1():
    return render_template("index.html")
@app.route("/2", methods=["GET"])
def home2():
    return render_template("kauli.html")
@app.route("/3", methods=["GET"])
def home3():
    return render_template("login.html")
@app.route("/4", methods=["GET"])
def home4():
    return render_template("muskuli.html")
@app.route("/5", methods=["GET"])
def home5():
    return render_template("organi.html")
@app.route("/6", methods=["GET"])
def home6():
    return render_template("rezultati.html")


@app.route( "/register", methods=["POST"])
def register():

    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    required = ["vards", "lietotajvards", "parole", "e_pasts"]
    if not all(field in data for field in required):
        return jsonify({"error": "Missing fields"}), 400
    
    db = None
    cursor = None

    try:
        db = mysql.connector.connect(**DB_CONFIG)
        cursor = db.cursor()

        sql = """
            INSERT INTO lietotaji (vards, lietotajvards, parole, e_pasts)
            VALUES (%s, %s, %s, %s)
        """

        values = (
            data["vards"],
            data["lietotajvards"],
            generate_password_hash(data["parole"]),
            data["e_pasts"]
        )

        cursor.execute(sql, values)
        db.commit()

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500
    
    except mysql.connector.IntegrityError:
        return jsonify({"error": "User already exists"}), 409

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

    return jsonify({"status": "ok"}), 201

@app.route("/log_in", methods=["POST"])
def log_in():
    data_log = request.get_json()
    if not data_log:
        return jsonify({"error": "Invalid JSON"}), 400

    required = ["lietotajvards", "parole"]
    if not all(field in data_log for field in required):
        return jsonify({"error": "Missing fields"}), 400

    db = None
    cursor = None

    try:
        db = mysql.connector.connect(**DB_CONFIG)
        cursor = db.cursor()
        cursor.execute(
            "SELECT parole FROM lietotaji WHERE lietotajvards = %s",
            (data_log["lietotajvards"],)
        )
        myresult = cursor.fetchone()

        if not myresult or not check_password_hash(myresult[0], data_log["parole"]):
            return jsonify({"error": "Invalid credentials"}), 401

        # Login successful → save in session
        session["user"] = data_log["lietotajvards"]
        return jsonify(ok=True)

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route("/log_out", methods=["POST"])
def log_out():
    session.pop("user", None) 
    return jsonify(ok=True)    

@app.route("/are_u_loged_in", methods=["GET"])
def are_u_loged_in():
    if "user" in session:
        return jsonify(ok=True, username=session["user"])
    else:
        return jsonify(ok=False, error="Not logged in"), 401
    
@app.route("/change_password", methods=["POST"])
def change_password():
    if "user" not in session:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        return jsonify({"error": "Missing fields"}), 400

    db = None
    cursor = None

    try:
        db = mysql.connector.connect(**DB_CONFIG)
        cursor = db.cursor()

        cursor.execute(
            "SELECT parole FROM lietotaji WHERE lietotajvards = %s",
            (session["user"],)
        )
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "User not found"}), 404

        # 2. Check old password
        if not check_password_hash(result[0], old_password):
            return jsonify({"error": "Wrong old password"}), 401

        # 3. Update password
        new_hash = generate_password_hash(new_password)

        cursor.execute(
            "UPDATE lietotaji SET parole = %s WHERE lietotajvards = %s",
            (new_hash, session["user"])
        )
        db.commit()

        return jsonify({"ok": True})

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route("/send_result", methods=["POST"])
def send_result():
    if "user" not in session:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    if not data or "rezultats" not in data or "spele" not in data:
        return jsonify({"error": "Missing data"}), 400

    try:
        db = mysql.connector.connect(**DB_CONFIG)
        cursor = db.cursor()

        # count attempts FIRST
        cursor.execute(
            "SELECT COUNT(*) FROM rezultati WHERE lietotajvards=%s AND spele=%s",
            (session["user"], data["spele"])
        )
        attempts = cursor.fetchone()[0] + 1

        # insert full record
        cursor.execute("""
            INSERT INTO rezultati (lietotajvards, rezultats, spele, meginajumi)
            VALUES (%s, %s, %s, %s)
        """, (
            session["user"],
            data["rezultats"],
            data["spele"],
            attempts
        ))

        db.commit()
        return jsonify({"ok": True})

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor: cursor.close()
        if db: db.close()

@app.route("/paradit_rez", methods=["GET"])
def paradit_rez():
    if "user" not in session:
        return jsonify(ok=False, error="Not logged in"), 401

    try:
        db = mysql.connector.connect(**DB_CONFIG)
        cursor = db.cursor()

        cursor.execute(
            """
            SELECT rezultats, spele, meginajumi
            FROM rezultati
            WHERE lietotajvards = %s
            ORDER BY meginajumi DESC
            """,
            (session["user"],)
        )

        rows = cursor.fetchall()

        return jsonify({
            "ok": True,
            "username": session["user"],
            "rezultati": rows
        })

    except mysql.connector.Error as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
