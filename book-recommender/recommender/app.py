import os
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")  # store in .env or your terminal

app = Flask(__name__)
books = pd.read_csv('books.csv')
books['combined'] = books['title'] + " " + books['author'] + " " + books['genre'] + " " + books['description']

vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(books['combined'])

def generate_reason(book):
    prompt = f"""
    The following book is being recommended to a reader:
    Title: {book['title']}
    Author: {book['author']}
    Genre: {book['genre']}
    Description: {book['description']}

    Write a short reason (2-3 sentences) on why this book might be a good recommendation.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # or "gpt-4" if available
            messages=[{"role": "user", "content": prompt}]
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return "Recommended because it shares a similar theme and genre."

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    title = data.get('title')

    if title not in books['title'].values:
        return jsonify({"error": "Book not found"}), 404

    idx = books[books['title'] == title].index[0]
    cosine_sim = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()
    similar_indices = cosine_sim.argsort()[-6:][::-1]

    recommendations = []
    for i in similar_indices[1:]:
        book = books.iloc[i]
        reason = generate_reason(book)
        recommendations.append({
            "title": book['title'],
            "author": book['author'],
            "reason": reason
        })

    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5001)
