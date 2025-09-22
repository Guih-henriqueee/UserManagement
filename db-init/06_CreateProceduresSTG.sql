-- Active: 1758424882115@@127.0.0.1@5432@datalake@staging
CREATE OR REPLACE PROCEDURE cadastrar_usuario(IN p_nome character varying, IN p_sobrenome character varying, IN p_cpf character, IN p_data_nascimento date, IN p_data_admissao date, IN p_cargo_nome character varying, IN p_nivel_permissao integer, IN p_departamento_nome character varying, IN p_gerente_cpf character DEFAULT NULL::bpchar, IN p_status boolean DEFAULT true)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_cargo_id INT;
    v_departamento_id INT;
    v_gerente_id INT;
    v_nivel_permissao_id INT;
    v_max_nivel INT;
BEGIN
    -- Validar se o usuário já existe
    IF EXISTS (SELECT 1 FROM usuarios WHERE cpf = p_cpf) THEN
        RAISE EXCEPTION 'Usuário com CPF % já existe', p_cpf;
    END IF;

    -- Buscar cargo
    SELECT id, max_nivel INTO v_cargo_id, v_max_nivel
    FROM cargos
    WHERE nome = p_cargo_nome;

    IF v_cargo_id IS NULL THEN
        RAISE EXCEPTION 'Cargo % não encontrado', p_cargo_nome;
    END IF;

    -- Buscar departamento
    SELECT id INTO v_departamento_id
    FROM departamentos
    WHERE nome = p_departamento_nome;

    IF v_departamento_id IS NULL THEN
        RAISE EXCEPTION 'Departamento % não encontrado', p_departamento_nome;
    END IF;

    -- Buscar nível de permissão
    SELECT id INTO v_nivel_permissao_id
    FROM niveis_permissao
    WHERE nivel = p_nivel_permissao;

    IF v_nivel_permissao_id IS NULL THEN
        RAISE EXCEPTION 'Nível de permissão % inválido', p_nivel_permissao;
    END IF;

    -- Buscar gerente, se fornecido
    IF p_gerente_cpf IS NOT NULL THEN
        SELECT id INTO v_gerente_id
        FROM usuarios
        WHERE cpf = p_gerente_cpf;

        IF v_gerente_id IS NULL THEN
            RAISE EXCEPTION 'Gerente com CPF % não encontrado', p_gerente_cpf;
        END IF;

        -- Validar hierarquia: gerente deve ter nível >= usuário
        IF (SELECT np.nivel FROM usuarios u
            JOIN niveis_permissao np
            ON u.nivel_permissao_id = np.id
            WHERE u.id = v_gerente_id) < p_nivel_permissao THEN
            RAISE EXCEPTION 'O gerente deve ter nível igual ou superior ao usuário';
        END IF;
    END IF;

    -- Inserir usuário
    INSERT INTO usuarios(
        nome, sobrenome, cpf, nivel_permissao_id, cargo_id, departamento_id, gerente_id,
        data_nascimento, data_admissao, status
    )
    VALUES (
        p_nome, p_sobrenome, p_cpf, v_nivel_permissao_id, v_cargo_id, v_departamento_id, v_gerente_id,
        p_data_nascimento, p_data_admissao, p_status
    );

    RAISE NOTICE 'Usuário % % cadastrado com sucesso', p_nome, p_sobrenome;
END;
$procedure$
