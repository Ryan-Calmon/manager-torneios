from flask import Blueprint, request, jsonify
from src.models.torneio import TorneioManager

torneio_bp = Blueprint('torneio', __name__)
torneio_manager = TorneioManager()

# ... (nenhuma alteração em get_status e set_categoria)
@torneio_bp.route('/status', methods=['GET'])
def get_status():
    try:
        status = torneio_manager.get_status()
        return jsonify({"success": True, "data": status})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@torneio_bp.route('/categoria', methods=['POST'])
def set_categoria():
    try:
        data = request.get_json()
        if not data or 'categoria' not in data:
            return jsonify({"success": False, "error": "Campo 'categoria' é obrigatório"}), 400
        categoria = data['categoria'].strip()
        if not categoria:
            return jsonify({"success": False, "error": "Categoria não pode estar vazia"}), 400
        torneio_manager.set_categoria(categoria)
        return jsonify({"success": True, "data": {"categoria": categoria}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# --- ALTERAÇÃO AQUI ---
@torneio_bp.route('/jogos', methods=['POST'])
def adicionar_jogo():
    """Adiciona um novo jogo"""
    try:
        data = request.get_json()
        if not data or 'dupla1' not in data or 'dupla2' not in data:
            return jsonify({"success": False, "error": "Campos 'dupla1' e 'dupla2' são obrigatórios"}), 400
        
        dupla1 = data['dupla1'].strip()
        dupla2 = data['dupla2'].strip()
        # Extrai o 'tipo' do JSON. Se não vier, usa 'normal' como padrão.
        tipo = data.get('tipo', 'normal').strip()
        
        if not dupla1 or not dupla2:
            return jsonify({"success": False, "error": "Duplas não podem estar vazias"}), 400
        
        # Passa o 'tipo' para o manager
        novo_jogo = torneio_manager.adicionar_jogo(dupla1, dupla2, tipo)
        return jsonify({"success": True, "data": {"jogo": novo_jogo}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ... (nenhuma alteração em iniciar_proximo_jogo e remover_jogo)
@torneio_bp.route('/jogos/iniciar-proximo', methods=['POST'])
def iniciar_proximo_jogo():
    try:
        sucesso = torneio_manager.iniciar_proximo_jogo()
        if not sucesso:
            return jsonify({"success": False, "error": "Nenhum jogo na fila"}), 400
        return jsonify({"success": True, "message": "Próximo jogo iniciado"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@torneio_bp.route('/jogos/<int:jogo_id>', methods=['DELETE'])
def remover_jogo(jogo_id):
    try:
        sucesso = torneio_manager.remover_jogo(jogo_id)
        if not sucesso:
            return jsonify({"success": False, "error": "Jogo não encontrado"}), 404
        return jsonify({"success": True, "message": "Jogo removido com sucesso"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
