import json
import os
from typing import List, Dict, Any

class TorneioManager:
    def __init__(self, data_file: str = None):
        if data_file is None:
            data_file = os.path.join(os.path.dirname(__file__), '..', 'database', 'torneio_data.json')
        self.data_file = data_file
        self._ensure_data_file()
    
    def _ensure_data_file(self):
        """Garante que o arquivo de dados existe com estrutura inicial"""
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        
        if not os.path.exists(self.data_file):
            # --- ALTERAÇÃO AQUI ---
            # Adicionado o campo 'tipo' aos jogos iniciais
            initial_data = {
                "categoria": "CATEGORIA DO TORNEIO",
                "jogos": [
                    {"id": 1, "dupla1": "João/Pedro", "dupla2": "Carlos/Ana", "tipo": "final"},
                    {"id": 2, "dupla1": "Maria/José", "dupla2": "Lucas/Sofia", "tipo": "terceiro-lugar"},
                    {"id": 3, "dupla1": "Bruno/Rita", "dupla2": "Diego/Carla", "tipo": "semi-final"},
                    {"id": 4, "dupla1": "Felipe/Laura", "dupla2": "Marcos/Julia", "tipo": "normal"},
                    {"id": 5, "dupla1": "André/Beatriz", "dupla2": "Rafael/Camila", "tipo": "normal"},
                    {"id": 6, "dupla1": "Gabriel/Fernanda", "dupla2": "Thiago/Patrícia", "tipo": "normal"},
                    {"id": 7, "dupla1": "Rodrigo/Isabela", "dupla2": "Eduardo/Mariana", "tipo": "normal"},
                    {"id": 8, "dupla1": "Gustavo/Letícia", "dupla2": "Vinicius/Amanda", "tipo": "normal"}
                ]
            }
            self._save_data(initial_data)
    
    def _load_data(self) -> Dict[str, Any]:
        """Carrega dados do arquivo JSON"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            self._ensure_data_file()
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
    
    def _save_data(self, data: Dict[str, Any]):
        """Salva dados no arquivo JSON"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    # ... (nenhuma alteração nas funções get_categoria, set_categoria, get_jogos, get_jogos_exibicao)
    def get_categoria(self) -> str:
        data = self._load_data()
        return data.get("categoria", "CATEGORIA DO TORNEIO")
    
    def set_categoria(self, categoria: str):
        data = self._load_data()
        data["categoria"] = categoria
        self._save_data(data)
    
    def get_jogos(self) -> List[Dict[str, Any]]:
        data = self._load_data()
        return data.get("jogos", [])
    
    def get_jogos_exibicao(self) -> List[Dict[str, Any]]:
        jogos = self.get_jogos()
        return jogos[:6]

    # --- ALTERAÇÃO AQUI ---
    # Adicionado o parâmetro 'tipo' com um valor padrão 'normal'
    def adicionar_jogo(self, dupla1: str, dupla2: str, tipo: str = 'normal') -> Dict[str, Any]:
        """Adiciona um novo jogo à fila"""
        data = self._load_data()
        jogos = data.get("jogos", [])
        
        novo_id = max([jogo.get("id", 0) for jogo in jogos], default=0) + 1
        
        novo_jogo = {
            "id": novo_id,
            "dupla1": dupla1.strip(),
            "dupla2": dupla2.strip(),
            "tipo": tipo  # Salva o tipo do jogo
        }
        
        jogos.append(novo_jogo)
        data["jogos"] = jogos
        self._save_data(data)
        
        return novo_jogo
    
    # ... (nenhuma alteração nas funções iniciar_proximo_jogo, remover_jogo, get_status)
    def iniciar_proximo_jogo(self) -> bool:
        data = self._load_data()
        jogos = data.get("jogos", [])
        if not jogos:
            return False
        jogos.pop(0)
        data["jogos"] = jogos
        self._save_data(data)
        return True
    
    def remover_jogo(self, jogo_id: int) -> bool:
        data = self._load_data()
        jogos = data.get("jogos", [])
        jogos_filtrados = [jogo for jogo in jogos if jogo.get("id") != jogo_id]
        if len(jogos_filtrados) == len(jogos):
            return False
        data["jogos"] = jogos_filtrados
        self._save_data(data)
        return True
    
    def get_status(self) -> Dict[str, Any]:
        data = self._load_data()
        jogos = data.get("jogos", [])
        return {
            "categoria": data.get("categoria", "CATEGORIA DO TORNEIO"),
            "total_jogos": len(jogos),
            "jogos_exibicao": jogos[:6],
            "proximo_jogo": jogos[0] if jogos else None
        }
