class MemosController < ApplicationController
  before_action :set_memo, only: %i[ show edit update destroy ]

  # GET /memos or /memos.json
  def index
    @memos = Memo.order(created_at: :desc)
  end

  # GET /memos/1 or /memos/1.json
  def show
  end

  # GET /memos/new
  def new
    @memo = Memo.new
  end

  # GET /memos/1/edit
  def edit
  end

  # POST /memos or /memos.json
  def create
    @memo = Memo.new(memo_params)
    @memo.user_id = 1
    respond_to do |format|
      if @memo.save
        format.html { redirect_to @memo, notice: "メモを作成しました." }
        format.json { render :show, status: :created, location: @memo }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @memo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /memos/1 or /memos/1.json
  def update
    respond_to do |format|
      if @memo.update(memo_params)
        format.html { redirect_to @memo, notice: "メモを更新しました." }
        format.json { render :show, status: :ok, location: @memo }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @memo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /memos/1 or /memos/1.json
  def destroy
    @memo.destroy!

    respond_to do |format|
      format.html { redirect_to memos_path, status: :see_other, notice: "メモを削除しました" }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_memo
      @memo = Memo.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def memo_params
      params.expect(memo: [ :title, :image_data, :user_id ])
    end
end
