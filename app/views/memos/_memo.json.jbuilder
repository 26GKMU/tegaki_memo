json.extract! memo, :id, :title, :image_data, :user_id, :created_at, :updated_at
json.url memo_url(memo, format: :json)
