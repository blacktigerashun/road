import sqlite3
import json
import os
from flask import Flask, request, jsonify, send_from_directory, redirect

# 不使用 Flask 内置 static 路由（static_folder='.' 会在根路径注册 /<path:filename>
# 与下方 serve_static 撞车且优先匹配，导致数据大屏等跨目录资源 404）；
# 全部静态请求统一由 serve_static 处理：先本目录，再回退项目根目录。
app = Flask(__name__, static_folder=None)

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'silkroad.db')

# 项目总目录（本目录的上一级）：用于回退服务 数据大屏/ 发布/ 等同级站点
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEFAULT_SITES = [
    {'id': 'kashi', 'name': '喀什古城', 'health': 97, 'temperature': 22.8, 'shake': 0.02, 'visitor_data': [20, 35, 50, 55, 70, 85, 95]},
    {'id': 'xuanquan', 'name': '悬泉置', 'health': 97, 'temperature': 21.8, 'shake': 0.02, 'visitor_data': [20, 35, 50, 55, 70, 85, 95]},
    {'id': 'weiyang', 'name': '未央宫', 'health': 98, 'temperature': 23.0, 'shake': 0.01, 'visitor_data': [20, 35, 50, 55, 70, 85, 95]},
    {'id': 'balingqiao', 'name': '渭源灞陵桥', 'health': 96, 'temperature': 20.5, 'shake': 0.03, 'visitor_data': [15, 30, 45, 55, 65, 80, 90]},
    {'id': 'yumenguan', 'name': '玉门关', 'health': 95, 'temperature': 18.5, 'shake': 0.04, 'visitor_data': [10, 25, 40, 50, 60, 75, 85]},
]


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute('''CREATE TABLE IF NOT EXISTS sites (
        id TEXT PRIMARY KEY,
        name TEXT,
        health REAL,
        temperature REAL,
        shake REAL,
        visitor_data TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    for s in DEFAULT_SITES:
        conn.execute(
            'INSERT OR IGNORE INTO sites (id, name, health, temperature, shake, visitor_data) VALUES (?,?,?,?,?,?)',
            (s['id'], s['name'], s['health'], s['temperature'], s['shake'], json.dumps(s['visitor_data']))
        )
    conn.commit()
    conn.close()


def row_to_dict(row):
    return {
        'id': row['id'], 'name': row['name'],
        'health': row['health'], 'temperature': row['temperature'],
        'shake': row['shake'], 'visitor_data': json.loads(row['visitor_data']),
        'updated_at': row['updated_at'],
    }


@app.route('/api/sites')
def api_get_sites():
    conn = get_db()
    rows = conn.execute('SELECT * FROM sites').fetchall()
    conn.close()
    return jsonify([row_to_dict(r) for r in rows])


@app.route('/api/sites/<site_id>')
def api_get_site(site_id):
    conn = get_db()
    row = conn.execute('SELECT * FROM sites WHERE id=?', (site_id,)).fetchone()
    conn.close()
    if row:
        return jsonify(row_to_dict(row))
    return jsonify({'error': 'not found'}), 404


@app.route('/api/sites/<site_id>', methods=['PUT'])
def api_update_site(site_id):
    data = request.json
    conn = get_db()
    conn.execute(
        'UPDATE sites SET health=?, temperature=?, shake=?, visitor_data=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
        (data['health'], data['temperature'], data['shake'], json.dumps(data['visitor_data']), site_id)
    )
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})


@app.route('/admin')
def admin():
    return send_from_directory('.', 'admin.html')


@app.route('/<path:filename>')
def serve_static(filename):
    # 优先本目录（丝绸之路站点），找不到时回退到项目根目录（数据大屏/发布/等站点）
    if os.path.isfile(os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)):
        return send_from_directory('.', filename)
    return send_from_directory(PROJECT_ROOT, filename)


@app.route('/')
def index():
    # 项目总门脸：数据大屏首页（丝绸之路主站仍可通过 /丝绸之路 .html 访问）
    return redirect('/数据大屏/index.html')


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
