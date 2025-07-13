// Navegação suave e destaque do menu
const menuLinks = document.querySelectorAll('.menu a');
menuLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 40,
        behavior: 'smooth'
      });
      menuLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }
  });
});

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY || document.documentElement.scrollTop;
  document.querySelectorAll('main .section').forEach((section, idx) => {
    if (scrollPos + 100 >= section.offsetTop) {
      menuLinks.forEach(l => l.classList.remove('active'));
      if (menuLinks[idx]) menuLinks[idx].classList.add('active');
    }
  });
});

// Remover função e mock antigos
// (Removido projetosMock e renderPortfolio)

// Lógica simples de login admin
// Variável global para status de admin
function isAdmin() {
  return sessionStorage.getItem('nexure_admin') === 'true';
}

function loginAdmin() {
  const senha = document.getElementById('admin-password').value;
  if (senha === 'nexure2024') {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    sessionStorage.setItem('nexure_admin', 'true');
    renderProjetos();
    preencherAdminContatos();
  } else {
    alert('Senha incorreta!');
  }
}
window.loginAdmin = loginAdmin;

// (Próximos passos: upload de projetos, marca d’água, salvar projetos, etc.)

// Utilitário para aplicar marca d'água em uma imagem usando canvas
async function aplicarMarcaDagua(file, marcaUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const marca = new Image();
    img.onload = () => {
      marca.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // Marca d'água no canto inferior direito, 30% do tamanho da imagem
        const marcaW = img.width * 0.3;
        const marcaH = marca.height * (marcaW / marca.width);
        ctx.globalAlpha = 0.35;
        ctx.drawImage(marca, img.width - marcaW - 10, img.height - marcaH - 10, marcaW, marcaH);
        ctx.globalAlpha = 1;
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      marca.src = 'marca.png';
    };
    img.onerror = marca.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Carregar projetos do localStorage
function getProjetos() {
  return JSON.parse(localStorage.getItem('nexure_projetos') || '[]');
}
function setProjetos(projetos) {
  localStorage.setItem('nexure_projetos', JSON.stringify(projetos));
}

// Atualizar renderização dos projetos
function renderProjetos(filtro = '') {
  const list = document.getElementById('projetos-list');
  list.innerHTML = '';
  let projetos = getProjetos();
  const adminLogado = isAdmin();
  if (filtro) {
    const f = filtro.toLowerCase();
    projetos = projetos.filter(p => p.nome.toLowerCase().includes(f) || p.descricao.toLowerCase().includes(f));
  }
  if (projetos.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:#888;">Nenhum projeto cadastrado ainda.</p>';
    return;
  }
  projetos.forEach((proj, idx) => {
    const item = document.createElement('div');
    item.className = 'projetos-item';
    // Carrossel de imagens
    const carrossel = document.createElement('div');
    carrossel.className = 'carrossel-imagens';
    let imgIndex = 0;
    const imgEl = document.createElement('img');
    imgEl.src = proj.imagens[0];
    imgEl.alt = proj.nome;
    imgEl.className = 'carrossel-img';
    carrossel.appendChild(imgEl);
    if (proj.imagens.length > 1) {
      // Setas SVG
      const setaEsq = document.createElement('button');
      setaEsq.innerHTML = `<svg width='22' height='22' fill='none' stroke='#fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'><polyline points='15 18 9 12 15 6'/></svg>`;
      setaEsq.className = 'carrossel-seta carrossel-seta-esq';
      setaEsq.onclick = (e) => {
        e.stopPropagation();
        imgIndex = (imgIndex - 1 + proj.imagens.length) % proj.imagens.length;
        imgEl.classList.add('fade-out');
        setTimeout(() => {
          imgEl.src = proj.imagens[imgIndex];
          imgEl.classList.remove('fade-out');
        }, 200);
      };
      carrossel.appendChild(setaEsq);
      const setaDir = document.createElement('button');
      setaDir.innerHTML = `<svg width='22' height='22' fill='none' stroke='#fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'><polyline points='9 6 15 12 9 18'/></svg>`;
      setaDir.className = 'carrossel-seta carrossel-seta-dir';
      setaDir.onclick = (e) => {
        e.stopPropagation();
        imgIndex = (imgIndex + 1) % proj.imagens.length;
        imgEl.classList.add('fade-out');
        setTimeout(() => {
          imgEl.src = proj.imagens[imgIndex];
          imgEl.classList.remove('fade-out');
        }, 200);
      };
      carrossel.appendChild(setaDir);
    }
    // Clique na imagem: tela cheia
    imgEl.onclick = () => {
      abrirModalImagem(proj.imagens, imgIndex);
    };
    item.appendChild(carrossel);
    // Título e descrição
    const title = document.createElement('h4');
    title.textContent = proj.nome;
    item.appendChild(title);
    const desc = document.createElement('p');
    desc.textContent = proj.descricao;
    item.appendChild(desc);
    // Botões admin
    if (adminLogado) {
      const btnDel = document.createElement('button');
      btnDel.textContent = 'Excluir';
      btnDel.style.marginTop = '10px';
      btnDel.style.background = '#ff4b4b';
      btnDel.style.color = '#fff';
      btnDel.style.border = 'none';
      btnDel.style.borderRadius = '6px';
      btnDel.style.padding = '6px 18px';
      btnDel.style.cursor = 'pointer';
      btnDel.onclick = function() {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
          const projetos = getProjetos();
          projetos.splice(idx, 1);
          setProjetos(projetos);
          renderProjetos();
        }
      };
      item.appendChild(btnDel);
      // Botão de editar
      const btnEdit = document.createElement('button');
      btnEdit.textContent = 'Editar';
      btnEdit.style.marginTop = '10px';
      btnEdit.style.marginLeft = '10px';
      btnEdit.style.background = '#4b4bff';
      btnEdit.style.color = '#fff';
      btnEdit.style.border = 'none';
      btnEdit.style.borderRadius = '6px';
      btnEdit.style.padding = '6px 18px';
      btnEdit.style.cursor = 'pointer';
      btnEdit.onclick = function() {
        abrirModalEdicao(idx);
      };
      item.appendChild(btnEdit);
    }
    list.appendChild(item);
  });
  
  // Adicionar funcionalidade do modo focus
  const projetosItems = document.querySelectorAll('.projetos-item');
  projetosItems.forEach(item => {
    let focusTimeout;
    
    // Ativar modo focus ao passar o mouse
    item.addEventListener('mouseenter', () => {
      clearTimeout(focusTimeout);
      // Remover modo focus de outros itens
      projetosItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('focus-mode');
        }
      });
      // Ativar modo focus no item atual
      item.classList.add('focus-mode');
    });
    
    // Desativar modo focus ao sair do mouse
    item.addEventListener('mouseleave', () => {
      focusTimeout = setTimeout(() => {
        item.classList.remove('focus-mode');
      }, 300); // Pequeno delay para transições suaves
    });
    
    // Manter modo focus ao clicar (para mobile)
    item.addEventListener('click', (e) => {
      // Não ativar se clicou em botão ou link
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
        return;
      }
      
      // Toggle do modo focus
      if (item.classList.contains('focus-mode')) {
        item.classList.remove('focus-mode');
      } else {
        projetosItems.forEach(otherItem => {
          otherItem.classList.remove('focus-mode');
        });
        item.classList.add('focus-mode');
      }
    });
  });
}



// Submissão do formulário de novo projeto
const form = document.getElementById('project-form');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nome = document.getElementById('project-name').value.trim();
    const descricao = document.getElementById('project-desc').value.trim();
    const files = document.getElementById('project-images').files;
    if (!nome || !descricao || files.length === 0) {
      hideLoader();
      alert('Preencha todos os campos e selecione pelo menos uma imagem.');
      return;
    }
    if (files.length > 5) {
      alert('Você pode adicionar no máximo 5 imagens por projeto.');
      return;
    }
    // Aplicar marca d'água em cada imagem
    const imagens = [];
    for (let i = 0; i < files.length; i++) {
              const imgComMarca = await aplicarMarcaDagua(files[i], 'marca.png');
      imagens.push(imgComMarca);
    }
    // Salvar projeto
    const projetos = getProjetos();
    projetos.unshift({ nome, descricao, imagens });
    setProjetos(projetos);
    renderProjetos();
    form.reset();
    alert('Projeto adicionado com sucesso!');
  });
}

// Filtro de busca
const filtroBusca = document.getElementById('filtro-busca');
if (filtroBusca) {
  filtroBusca.addEventListener('input', function() {
    renderProjetos(this.value);
  });
}

// Renderizar projetos ao carregar a página
renderProjetos();

// Desativar modo focus ao clicar fora dos projetos
document.addEventListener('click', (e) => {
  if (!e.target.closest('.projetos-item')) {
    document.querySelectorAll('.projetos-item').forEach(item => {
      item.classList.remove('focus-mode');
    });
  }
});

// Modal de edição
function abrirModalEdicao(idx) {
  const projetos = getProjetos();
  const proj = projetos[idx];
  // Cria modal
  let modal = document.getElementById('modal-edicao');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-edicao';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.4)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `<div style="background:#fff;padding:32px 24px;border-radius:16px;max-width:400px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.12);position:relative;">
    <h3 style='margin-top:0;'>Editar Projeto</h3>
    <form id='form-editar-projeto'>
      <input type='text' id='edit-nome' value="${proj.nome}" style='width:100%;margin-bottom:10px;padding:8px;border-radius:6px;border:1px solid #bbb;'>
      <textarea id='edit-desc' style='width:100%;margin-bottom:10px;padding:8px;border-radius:6px;border:1px solid #bbb;'>${proj.descricao}</textarea>
      <label>Imagens (deixe vazio para manter as atuais):</label>
      <input type='file' id='edit-imagens' accept='image/jpeg' multiple style='margin-bottom:10px;'>
      <div style='text-align:right;'>
        <button type='button' id='btn-cancelar-edicao' style='margin-right:10px;background:#bbb;color:#fff;border:none;border-radius:6px;padding:6px 18px;cursor:pointer;'>Cancelar</button>
        <button type='submit' style='background:#4b4bff;color:#fff;border:none;border-radius:6px;padding:6px 18px;cursor:pointer;'>Salvar</button>
      </div>
    </form>
  </div>`;
  document.getElementById('btn-cancelar-edicao').onclick = () => { modal.remove(); };
  document.getElementById('form-editar-projeto').onsubmit = async function(e) {
    e.preventDefault();
    const nome = document.getElementById('edit-nome').value.trim();
    const descricao = document.getElementById('edit-desc').value.trim();
    const files = document.getElementById('edit-imagens').files;
    let imagens = proj.imagens;
    if (files.length > 0) {
      if (files.length > 5) {
        alert('Você pode adicionar no máximo 5 imagens por projeto.');
        return;
      }
      imagens = [];
      for (let i = 0; i < files.length; i++) {
        const imgComMarca = await aplicarMarcaDagua(files[i], 'marca.png');
        imagens.push(imgComMarca);
      }
    }
    projetos[idx] = { nome, descricao, imagens };
    setProjetos(projetos);
    renderProjetos();
    modal.remove();
    alert('Projeto editado com sucesso!');
  };
}

// Modal de imagem em tela cheia (com loader)
function abrirModalImagem(imagens, startIndex) {
  let imgIndex = startIndex;
  let modal = document.getElementById('modal-imagem');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-imagem';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.88)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '99999';
    document.body.appendChild(modal);
  }
  function renderModalImg() {
    const img = new window.Image();
    img.onload = () => {
      modal.innerHTML = `<div style='position:relative;max-width:90vw;max-height:90vh;display:flex;align-items:center;justify-content:center;'>
        <img src='${imagens[imgIndex]}' style='max-width:90vw;max-height:80vh;border-radius:16px;box-shadow:0 8px 32px #000a;transition:opacity 0.2s;'>
        <button id='fechar-modal-img' style='position:absolute;top:12px;right:12px;background:#222;border:none;border-radius:50%;width:36px;height:36px;color:#fff;font-size:1.5rem;cursor:pointer;z-index:2;'>&times;</button>
        ${imagens.length > 1 ? `<button id='modal-img-esq' style='position:absolute;left:8px;top:50%;transform:translateY(-50%);background:#222;border:none;border-radius:50%;width:36px;height:36px;color:#fff;font-size:1.5rem;cursor:pointer;z-index:2;'><svg width='22' height='22' fill='none' stroke='#fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'><polyline points='15 18 9 12 15 6'/></svg></button>` : ''}
        ${imagens.length > 1 ? `<button id='modal-img-dir' style='position:absolute;right:8px;top:50%;transform:translateY(-50%);background:#222;border:none;border-radius:50%;width:36px;height:36px;color:#fff;font-size:1.5rem;cursor:pointer;z-index:2;'><svg width='22' height='22' fill='none' stroke='#fff' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'><polyline points='9 6 15 12 9 18'/></svg></button>` : ''}
      </div>`;
      document.getElementById('fechar-modal-img').onclick = () => modal.remove();
      if (imagens.length > 1) {
        document.getElementById('modal-img-esq').onclick = (e) => {
          e.stopPropagation();
          imgIndex = (imgIndex - 1 + imagens.length) % imagens.length;
          renderModalImg();
        };
        document.getElementById('modal-img-dir').onclick = (e) => {
          e.stopPropagation();
          imgIndex = (imgIndex + 1) % imagens.length;
          renderModalImg();
        };
      }
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    };
    img.src = imagens[imgIndex];
  }
  renderModalImg();
}

// Funções para salvar e carregar contatos personalizados
function getContatos() {
  const contatos = JSON.parse(localStorage.getItem('nexure_contatos') || '{}');
  return {
    email: contatos.email || 'nexureservicos@gmail.com',
    instagram: contatos.instagram || '@nexure.team',
    whatsapp: contatos.whatsapp || ''
  };
}
function setContatos({ email, instagram, whatsapp }) {
  localStorage.setItem('nexure_contatos', JSON.stringify({ email, instagram, whatsapp }));
}

// Atualiza a seção de contato com os dados salvos
function renderContatos() {
  const { email, instagram, whatsapp } = getContatos();
  const contatoInfo = document.querySelector('.contato-info ul');
  if (!contatoInfo) return;
  contatoInfo.innerHTML = '';
  // Instagram
  contatoInfo.innerHTML += `<li style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
    <span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;">
      <svg width='22' height='22' fill='none' stroke='#4b4bff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'><path d='M4 4h16v16H4z'/><circle cx='12' cy='12' r='3.5'/><circle cx='18' cy='6' r='1'/></svg>
    </span>
    <a href='https://instagram.com/${instagram.replace('@','')}' target='_blank' rel='noopener' style='font-size:1.08rem;color:#4b4bff;text-decoration:none;font-weight:600;'>${instagram}</a>
  </li>`;
  // Email
  contatoInfo.innerHTML += `<li style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
    <span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;">
      <svg width='22' height='22' fill='none' stroke='#4b4bff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'><rect x='2' y='4' width='20' height='16' rx='2'/><path d='M22 6l-10 7L2 6'/></svg>
    </span>
    <a href='mailto:${email}' style='font-size:1.08rem;color:#4b4bff;text-decoration:none;font-weight:600;'>${email}</a>
  </li>`;
  // WhatsApp (opcional)
  if (whatsapp && whatsapp.trim() !== '') {
    contatoInfo.innerHTML += `<li style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
      <span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;">
        <svg width='22' height='22' fill='none' stroke='#4b4bff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' viewBox='0 0 24 24'><rect x='2' y='6' width='20' height='12' rx='2'/><path d='M6 10h.01'/><path d='M18 10h.01'/><path d='M12 14h.01'/></svg>
      </span>
      <span style='font-size:1.08rem;color:#e0e0e0;'>${whatsapp}</span>
    </li>`;
  }
}

// Preencher campos do admin com dados salvos
function preencherAdminContatos() {
  const { email, instagram, whatsapp } = getContatos();
  const emailInput = document.getElementById('admin-email');
  const instaInput = document.getElementById('admin-instagram');
  const whatsInput = document.getElementById('admin-whatsapp');
  if (emailInput) emailInput.value = email;
  if (instaInput) instaInput.value = instagram;
  if (whatsInput) whatsInput.value = whatsapp;
}

// Salvar contatos pelo painel admin
const contatoFormAdmin = document.getElementById('contato-form-admin');
if (contatoFormAdmin) {
  contatoFormAdmin.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const instagram = document.getElementById('admin-instagram').value.trim();
    const whatsapp = document.getElementById('admin-whatsapp').value.trim();
    setContatos({ email, instagram, whatsapp });
    renderContatos();
    alert('Contatos atualizados com sucesso!');
  });
}

// Renderizar contatos ao carregar a página
renderContatos();

// Animação secreta na logo ao clicar
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('click', () => {
    logo.classList.remove('efeito-secreto');
    void logo.offsetWidth; // reflow para reiniciar animação
    logo.classList.add('efeito-secreto');
  });
}

// Função de logout do admin
function logoutAdmin() {
  sessionStorage.removeItem('nexure_admin');
  document.getElementById('admin-panel').style.display = 'none';
  document.getElementById('admin-login').style.display = 'block';
  renderProjetos();
}
const btnLogout = document.getElementById('admin-logout');
if (btnLogout) {
  btnLogout.addEventListener('click', logoutAdmin);
}

// Parallax animado para formas SVG do fundo
function parallaxBg() {
  const shapes = [
    { el: document.querySelector('.shape1'), x: 0.04, y: 0.08 },
    { el: document.querySelector('.shape2'), x: -0.06, y: 0.12 },
    { el: document.querySelector('.shape3'), x: 0.10, y: -0.10 }
  ];
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    shapes.forEach((s, i) => {
      if (s.el) {
        s.el.style.transform = `translate3d(${sy * s.x}px, ${sy * s.y}px, 0)`;
      }
    });
  });
  window.addEventListener('mousemove', (e) => {
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    shapes.forEach((s, i) => {
      if (s.el) {
        s.el.style.transform += ` translate(${cx * 20 * (i+1)}px, ${cy * 20 * (i+1)}px)`;
      }
    });
  });
}
parallaxBg();