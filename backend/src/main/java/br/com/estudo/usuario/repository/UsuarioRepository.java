package br.com.estudo.usuario.repository;

import br.com.estudo.usuario.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {

    List<Usuario> findByNome(String nome);
}