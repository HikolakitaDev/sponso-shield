from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter
import json
import re

app = Flask(__name__)

def minimize_transcript_json(data_str):
    try:
        data = json.loads(data_str)
    except json.JSONDecodeError as e:
        return f"Error parsing JSON: {e}"
    
    filtered_data = [item for item in data if not re.match(r'^\[.*\]$', item.get('text', ''))]
    
    minimized_data = []
    for item in filtered_data:
        minimized_item = {
            "text": item.get("text", ""),
            "s": item.get("start", 0),
            "d": item.get("duration", 0)
        }
        minimized_data.append(minimized_item)
    
    return minimized_data

@app.route('/get_transcript', methods=['GET'])
def get_transcript_api():
    video_id = request.args.get('video_id')
    
    if not video_id:
        return jsonify({"error": "No video_id provided"}), 400
    
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        formatter = JSONFormatter()
        formatted_transcript = formatter.format_transcript(transcript)
        minimized_transcript = minimize_transcript_json(formatted_transcript)
        
        return jsonify(minimized_transcript)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)