import React from 'react';
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import "./style.css";
import logo from "../../assets/logo.svg";

const CreateCollectPoint = () => {
  return (
     <div id="page-create-collect-point">
        <header>
            <img src={logo} alt="Ecoleta"/>

            <Link to="/">
              <FiArrowLeft />
              Voltar para a home
            </Link>
        </header>

		<form action="">
			<h1>Cadastro do <br/> ponto de coleta</h1>

			<fieldset>
				<legend>
					<h2>Dados</h2>
				</legend>

				<div className="field">
					<label htmlFor="name">Nome da entidade</label>
					<input 
					type="text"
					id="name"
					name="name"
					/>
				</div>

				<div className="field-group">
					<div className="field">
						<label htmlFor="email">Email</label>
						<input 
							type="email"
							id="email"
							name="email"
						/>
					</div>

					<div className="field">
						<label htmlFor="whatsapp">Whatsapp</label>
						<input 
							type="text"
							id="whatsapp"
							name="whatsapp"
						/>
					</div>
				</div>
			</fieldset>

			<fieldset>
				<legend>
					<h2>Endereço</h2>
					<span>Selecione o endereço no mapa</span>
				</legend>

				<div className="field-group">
					<div className="field">
						<label htmlFor="email">Cidade</label>
						<select name="city" id="city">
							<option value="0">Selecione uma cidade</option>
						</select>
					</div>

					<div className="field">
						<label htmlFor="whatsapp">Estado (UF)</label>
						<select name="uf" id="uf">
							<option value="0">Selecione uma UF</option>
						</select>
					</div>
				</div>
			</fieldset>

			<fieldset>
				<legend>
					<h2>Ítens de coleta</h2>
					<span>Selecione um ou mais itens abaixo</span>
				</legend>

				<ul className="items-grid">
					<li>
						<img src="http://localhost:3333/uploads/lampadas.svg" alt="lampada"/>
						<span>Lâmpada</span>
					</li>
					<li className="selected">
						<img src="http://localhost:3333/uploads/lampadas.svg" alt="lampada"/>
						<span>Lâmpada</span>
					</li>
					<li>
						<img src="http://localhost:3333/uploads/lampadas.svg" alt="lampada"/>
						<span>Lâmpada</span>
					</li>
					<li>
						<img src="http://localhost:3333/uploads/lampadas.svg" alt="lampada"/>
						<span>Lâmpada</span>
					</li>
					<li>
						<img src="http://localhost:3333/uploads/lampadas.svg" alt="lampada"/>
						<span>Lâmpada</span>
					</li>
					<li>
						<img src="http://localhost:3333/uploads/lampadas.svg" alt="lampada"/>
						<span>Lâmpada</span>
					</li>
				</ul>
			</fieldset>

			<button type="submit">
				Cadastrar ponto de coleta	
			</button>

		</form>
     </div>
  );
}

export default CreateCollectPoint;
