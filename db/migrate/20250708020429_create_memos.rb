class CreateMemos < ActiveRecord::Migration[8.0]
  def change
    create_table :memos do |t|
      t.string :title
      t.text :image_data
       t.references :user, foreign_key: true, null: true 

      t.timestamps
    end
  end
end
