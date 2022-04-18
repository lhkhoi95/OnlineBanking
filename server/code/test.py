from sqlalchemy import create_engine

engine = create_engine('sqlite:///data.db')
with engine.connect() as con:

    rs = con.execute('DELETE FROM users WHERE id=1')
    
