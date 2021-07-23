
from re import template
import re
from typing import NoReturn
from flask import Flask, flash, redirect, render_template, request, url_for, g, jsonify
import sqlite3
import os
import flask
from flask.helpers import make_response
from flask.wrappers import Response

from werkzeug import datastructures

DATABASE = 'fixtures.db'

app = Flask(__name__)



def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


#live score entry and game select routes
@app.route('/game_select', methods=['get','POST'])
def game_select():
    
    cursor =get_db().cursor()
    sql0 = '''SELECT games.id,
                    competition.name,
                    t1.team_name,
                    t2.team_name,
                    games.kickoff_time,
                    games.date,
                    games.match_week,
                    location.park,
                    games.status_id
            FROM games
                    JOIN
                    team t1 ON games.home_team_id = t1.id
                    JOIN
                    team t2 ON games.away_team_id = t2.id
                    JOIN
                    competition ON games.competition_id = competition.id
                    JOIN
                    location ON games.location = location.id
             WHERE games.status_id = 1;

             '''
    cursor.execute(sql0)
    results= cursor.fetchall()

    print (request.form.get("fixure_select"))
    try:
        match_id = int(request.form.get('fixure_select'))
        
        return redirect(f'/live_score/{match_id}')
    except:
        print('no team')
        
     
    return render_template('game_select.html', fixures = results)


@app.route('/update_score/<id>/<type>/<data>', methods=['GET', 'POST'])
def update_score(id,type, data):
    print('receving data')
    print (f'type:  {type} \ngame_id:  {id} \ndata:  {data}')
    
    if (type) == 'home':
        cursor =get_db().cursor()
        sql = f''' UPDATE games
                        SET Home_score = {int(data)}
                     WHERE id = {int(id)};
                '''
        cursor.execute(sql)
        get_db().commit()
        print('sql exicuted sucsess home')       


    if (type) == 'away':
        cursor =get_db().cursor()
        sql = f''' UPDATE games
                        SET away_score = {int(data)}
                     WHERE id = {int(id)};
                '''
        cursor.execute(sql)
        get_db().commit()
        print('sql exicuted sucsess away') 

    if (type) == 'time_mins':
        cursor =get_db().cursor()
        sql = f''' UPDATE games
                SET ingame_mins = {int(data)}
                WHERE id = {int(id)};
        '''
        cursor.execute(sql)
        get_db().commit()
        print('sql exicuted sucsess time') 

    if (type) == 'submit_game':
        cursor =get_db().cursor()
        sql = f''' UPDATE games
                SET status_id = {int(data)}
                WHERE id = {int(id)};
        '''
        cursor.execute(sql)
        get_db().commit()
        print('sql exicuted sucsess time') 

    
    return {"status" : True}


@app.route('/get_data', methods=['GET', 'POST'])
def get_score():
    
    cursor =get_db().cursor()
    sql1 = f'''  select games.id,
                        games.Home_score,
                        games.away_score,
                        games.ingame_mins,
                        games.status_id,
                        games.kickoff_time,
                        games.date
                  from games
                order by games.date ASC;  
            '''
    cursor.execute(sql1)
    results = cursor.fetchall()

    return (jsonify(results), 200) 

@app.route('/live_score/<id>', methods=['GET', 'POST'])
def live_score(id):  
 
    try:
        id = int(id)
        if id > 0:
            pass
        else:
            return redirect(f'/game_select')
    except: 
        return redirect(f'/game_select')

    cursor =get_db().cursor()
    sql1 = f'''SELECT games.id,
                competition.name,
                t1.team_name,
                t2.team_name,
                games.kickoff_time,
                games.date,
                games.match_week,
                location.park,
                games.home_Score,
                games.away_score,
                games.ingame_mins
            FROM games
                JOIN
                team t1 ON games.home_team_id = t1.id
                JOIN
                team t2 ON games.away_team_id = t2.id
                JOIN
                competition ON games.competition_id = competition.id
                JOIN
                location ON games.location = location.id
              WHERE games.id = {id};   
            '''
    cursor.execute(sql1)
    results = cursor.fetchall()
    results = results[0]

    return render_template('live_score.html', game_info = results) 
  

@app.route('/',methods=['get','post'])
def game_veiwer():
    
    cursor =get_db().cursor()
    sql1 = f''' SELECT games.id,
       competition.name,
       t1.team_name,
       t2.team_name,
       games.kickoff_time,
       games.date,
       games.match_week,
       location.park,
       games.home_Score,
       games.away_score,
       games.ingame_mins,
       games.status_id
  FROM games
       JOIN
       team t1 ON games.home_team_id = t1.id
       JOIN
       team t2 ON games.away_team_id = t2.id
       JOIN
       competition ON games.competition_id = competition.id
       JOIN
       location ON games.location = location.id
       order by games.date ASC;  
            '''
    cursor.execute(sql1)
    results = cursor.fetchall()

    return render_template('game_viewer.html', games = results)


  
if __name__=='__main__':
    app.run(debug=True, host='0.0.0.0')