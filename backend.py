from flask import Flask, request, jsonify
import pickle
import requests
from flask_cors import CORS
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

api=os.getenv("API_Key")

# Load data
movies = pickle.load(open('artifacts/movie_list.pkl', 'rb'))
similarity = pickle.load(open('artifacts/similarity.pkl', 'rb'))

# Poster fetching function
def fetch_poster(movie_id):
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api}&language=en-US"
        response = requests.get(url)
        data = response.json()
        poster_path = data.get('poster_path')
        if poster_path:
            return f"https://image.tmdb.org/t/p/w500/{poster_path}"
        else:
            return "https://via.placeholder.com/300x450?text=No+Image"
    except:
        return "https://via.placeholder.com/300x450?text=Error"

# Recommendation logic
def recommend(movie_name):
    if movie_name not in movies['title'].values:
        return [], []

    index = movies[movies['title'] == movie_name].index[0]
    distances = list(enumerate(similarity[index]))
    distances = sorted(distances, reverse=True, key=lambda x: x[1])[1:6]

    recommended_names = []
    recommended_posters = []

    for i in distances:
        movie_id = movies.iloc[i[0]].movie_id
        recommended_names.append(movies.iloc[i[0]].title)
        recommended_posters.append(fetch_poster(movie_id))

    return recommended_names, recommended_posters

# Routes
@app.route('/movies', methods=['GET'])
def get_movies():
    movie_titles = movies['title'].tolist()
    return jsonify({'movies': movie_titles})

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    movie_name = data.get('movie')

    recommended_names, recommended_posters = recommend(movie_name)

    if not recommended_names:
        return jsonify({'error': 'Movie not found'}), 404

    return jsonify({
        'recommended_movies': recommended_names,
        'recommended_posters': recommended_posters
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
