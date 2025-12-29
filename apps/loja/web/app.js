const app = (() => {
    // Helpers
    const id = (s) => document.getElementById(s);
    const formatMoney = (val) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(val);

    // Estado
    const state = {
        baseUrl: id('baseUrl').value,
        currentTab: 'produtos',
    };

    // Elementos DOM
    const els = {
        baseInput: id('baseUrl'),
        views: {
            produtos: id('viewProdutos'),
            usuarios: id('viewUsuarios'),
        },
        tabs: {
            produtos: id('tabProdutos'),
            usuarios: id('tabUsuarios'),
        },
        forms: {
            produto: id('formCardProduto'),
            usuario: id('formCardUsuario'),
        },
        lists: {
            produtos: id('produtosList'),
            usuarios: id('usuariosList'),
        },
        counts: {
            produtos: id('countProdutos'),
            usuarios: id('countUsuarios'),
        },
        createForms: {
            produto: id('createProdutoForm'),
            usuario: id('createUsuarioForm'),
        },
    };

    // Atualiza URL base se usuário mudar
    els.baseInput.addEventListener('input', (e) => {
        state.baseUrl = e.target.value.replace(/\/+$/, '');
    });

    // --- Lógica de Abas ---
    function switchTab(tabName) {
        state.currentTab = tabName;

        // Toggle Classes das Abas
        Object.keys(els.tabs).forEach((k) => {
            if (k === tabName) els.tabs[k].classList.add('active');
            else els.tabs[k].classList.remove('active');
        });

        // Toggle Visibilidade das Seções
        Object.keys(els.views).forEach((k) => {
            if (k === tabName) els.views[k].classList.remove('hidden');
            else els.views[k].classList.add('hidden');
        });

        // Toggle Visibilidade dos Forms Laterais (Contextual)
        if (tabName === 'produtos') {
            els.forms.produto.classList.remove('hidden');
            els.forms.usuario.classList.add('hidden');
            fetchProdutos(); // Recarrega ao entrar
        } else {
            els.forms.produto.classList.add('hidden');
            els.forms.usuario.classList.remove('hidden');
            fetchUsuarios(); // Recarrega ao entrar
        }
    }

    // --- API: Produtos ---
    async function fetchProdutos() {
        renderLoading(els.lists.produtos, 'Atualizando catálogo...');
        try {
            const res = await fetch(`${state.baseUrl}/produtos`);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const data = await res.json();
            renderProdutos(data);
        } catch (err) {
            renderError(els.lists.produtos, err.message);
        }
    }

    function renderProdutos(list) {
        if (!Array.isArray(list))
            return renderError(
                els.lists.produtos,
                'Formato inválido recebido.',
            );

        els.counts.produtos.innerText = `${list.length} itens`;

        if (list.length === 0) {
            els.lists.produtos.innerHTML = `<div class="empty-state">Nenhum produto cadastrado.</div>`;
            return;
        }

        els.lists.produtos.innerHTML = list
            .map((p) => {
                // Fallback visual para imagem
                const imgUrl =
                    p.imagens && p.imagens.length ? p.imagens[0].url : null;
                const imgHtml = imgUrl
                    ? `<img src="${imgUrl}" alt="${p.nome}" onerror="this.src='https://placehold.co/400x300?text=Erro+Imagem'">`
                    : `<span style="font-size:3rem">📦</span>`;

                // Renderiza características se existirem
                const caracsHtml =
                    p.caracteristicas && p.caracteristicas.length
                        ? `<div style="font-size:0.75rem; color:#6b7280; background:#f3f4f6; padding:6px; border-radius:4px; margin-bottom:8px;">
                    <strong>${p.caracteristicas[0].nome}:</strong> ${p.caracteristicas[0].descricao}
                   </div>`
                        : '';

                return `
            <article class="produto-card fade-in">
                <div class="produto-img-area">
                    ${p.categoria ? `<span class="produto-tag">${p.categoria}</span>` : ''}
                    ${imgHtml}
                </div>
                <div class="produto-content">
                    <h3>${p.nome}</h3>
                    <div class="produto-price">${formatMoney(p.valor || 0)}</div>
                    ${caracsHtml}
                    <div class="produto-desc">${p.descricao || 'Sem descrição definida.'}</div>

                    <div class="produto-footer">
                        <span>Estoque: <strong>${p.quantidadeDisponivel}</strong></span>
                        <span>Criado em: ${p.dataCriacao ? new Date(p.dataCriacao).toLocaleDateString() : 'Hoje'}</span>
                    </div>
                </div>
            </article>`;
            })
            .join('');
    }

    // --- API: Usuários ---
    async function fetchUsuarios() {
        renderLoading(els.lists.usuarios, 'Buscando usuários...');
        try {
            const res = await fetch(`${state.baseUrl}/usuarios`);
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const data = await res.json();
            renderUsuarios(data);
        } catch (err) {
            renderError(els.lists.usuarios, err.message);
        }
    }

    function renderUsuarios(list) {
        if (!Array.isArray(list))
            return renderError(els.lists.usuarios, 'Formato inválido.');

        els.counts.usuarios.innerText = `${list.length} usuários`;

        if (list.length === 0) {
            els.lists.usuarios.innerHTML = `<div class="empty-state">Nenhum usuário encontrado.</div>`;
            return;
        }

        els.lists.usuarios.innerHTML = list
            .map((u) => {
                const initial = u.nome ? u.nome.charAt(0).toUpperCase() : '?';
                return `
            <div class="usuario-row fade-in">
                <div class="avatar-circle">${initial}</div>
                <div class="user-info">
                    <h4>${u.nome}</h4>
                    <span>${u.email || 'Sem e-mail'}</span>
                </div>
            </div>`;
            })
            .join('');
    }

    // --- Utilitários de Renderização ---
    function renderLoading(el, msg) {
        el.innerHTML = `<div class="loading-state">${msg}</div>`;
    }

    function renderError(el, msg) {
        el.innerHTML = `
            <div class="error-state">
                <strong>Erro de Conexão:</strong><br>
                ${msg}<br>
                <small style="margin-top:8px; display:block">Verifique se a API está rodando em ${state.baseUrl}</small>
            </div>`;
    }

    // --- Handlers de Formulário ---

    // Handler Genérico para POST
    async function handleSubmit(
        form,
        endpoint,
        payloadBuilder,
        successMsg,
        refreshFn,
    ) {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerText;

        btn.disabled = true;
        btn.innerText = 'Salvando...';

        try {
            const fd = new FormData(form);
            const payload = payloadBuilder(fd);

            const res = await fetch(`${state.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error((await res.text()) || res.statusText);

            await res.json(); // Consumir

            // Feedback visual temporário no botão
            btn.innerText = '✅ Sucesso!';
            btn.style.background = 'var(--secondary)';

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = ''; // Volta ao padrão CSS
                btn.disabled = false;
            }, 2000);

            form.reset();
            refreshFn(); // Recarrega lista
        } catch (err) {
            alert(`Erro ao salvar: ${err.message}`);
            btn.disabled = false;
            btn.innerText = originalText;
        }
    }

    // Submit Produto
    els.createForms.produto.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit(
            e.target,
            '/produtos',
            (fd) => {
                // Monta array de imagens (se houver URL)
                const imagens = fd.get('imagemUrl')
                    ? [
                          {
                              url: fd.get('imagemUrl'),
                              descricao: 'Imagem Principal',
                          },
                      ]
                    : [];

                // Monta array de características (se houver nome e descrição)
                const caracteristicas =
                    fd.get('caracNome') && fd.get('caracDesc')
                        ? [
                              {
                                  nome: fd.get('caracNome'),
                                  descricao: fd.get('caracDesc'),
                              },
                          ]
                        : [];

                return {
                    nome: fd.get('nome'),
                    valor: Number(fd.get('valor')) || 0,
                    quantidadeDisponivel:
                        Number(fd.get('quantidadeDisponivel')) || 0,
                    descricao: fd.get('descricao') || '',
                    categoria: fd.get('categoria') || '',
                    // Novos campos baseados no Type
                    imagens: imagens,
                    caracteristicas: caracteristicas,
                    dataCriacao: new Date().toISOString(), // Opcional: Front sugere a data
                    dataAtualizacao: new Date().toISOString(),
                };
            },
            'Produto criado com sucesso!',
            fetchProdutos,
        );
    });

    // Submit Usuário
    els.createForms.usuario.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit(
            e.target,
            '/usuarios',
            (fd) => ({
                nome: fd.get('nome'),
                email: fd.get('email'),
                senha: fd.get('senha'), // Novo campo obrigatório pelo Type
            }),
            'Usuário criado com sucesso!',
            fetchUsuarios,
        );
    });

    // Inicialização
    (function init() {
        // Tenta limpar URL base inicial
        state.baseUrl = els.baseInput.value.replace(/\/+$/, '');

        // Carrega primeira aba
        switchTab('produtos');
    })();

    return { switchTab };
})();
