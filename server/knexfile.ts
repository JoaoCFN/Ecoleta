// Trabalhar com caminhos dentro do node
import path from 'path';

// Configurações que a conexão com o banco não possui
module.exports = {
    client: "sqlite3",
    connection: {
        // path.resolve: une caminhos
        filename: path.resolve(__dirname, "src", "database", "database.sqlite"),
    },
    migrations : {
        directory : path.resolve(__dirname, "src", "database", "migrations"),
    },
    seeds: {
        directory : path.resolve(__dirname, "src", "database", "seeds"),
    },
    // Adiciona suporte a valores padrões no SQLITE
    useNullAsDefault: true,
}