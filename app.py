from flask import Flask, request, jsonify
import enchant

app = Flask(__name__)

# Initialize the English dictionary
dictionary = enchant.Dict("en_US")

@app.route('/check_word', methods=['GET'])
def check_word():
    word = request.args.get('word')
    if word and dictionary.check(word):
        return jsonify({"valid": True})
    return jsonify({"valid": False})

if __name__ == '__main__':
    app.run(debug=True)
