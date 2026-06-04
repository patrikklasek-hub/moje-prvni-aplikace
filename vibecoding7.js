const app = {
    // Přepínání stránek
    nav: function(target) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(target).classList.add('active');
        document.querySelector(`[data-target="${target}"]`).classList.add('active');
    },

    // Diagnostika data
    data: [
        { q: "MAŠINA NESTARTUJE?", a: [{t: "ANO, TOČÍ ALE NECHYTNE", n: 1}, {t: "NE, JE ÚPLNĚ MRTVÁ", n: 2}] },
        { q: "MÁ SVÍČKA JISKRU?", a: [{t: "ANO, HÁZÍ", r: "PROBLÉM V PALIVU (PUMPA/FILTR)"}, {t: "NE, JE BEZ JISKRY", r: "VADNÁ SVÍČKA NEBO INDUKČKA"}] },
        { q: "JE BATERIE NABITÁ?", a: [{t: "ANO", r: "VADNÉ STARTÉR RELÉ NEBO KOSTRA"}, {t: "NE", r: "NABIJ BATERKU NEBO KUP NOVOU"}] }
    ],

    renderDiag: function(idx) {
        const q = this.data[idx];
        const display = document.getElementById('options');
        document.getElementById('question').innerText = q.q;
        display.innerHTML = '';
        
        q.a.forEach(opt => {
            const b = document.createElement('button');
            b.className = 'btn btn-outline';
            b.innerText = opt.t;
            b.onclick = () => opt.r ? this.showResult(opt.r) : this.renderDiag(opt.n);
            display.appendChild(b);
        });
    },

    showResult: function(txt) {
        document.getElementById('question').innerText = "VÝSLEDEK:";
        document.getElementById('options').innerHTML = `<p style="font-size: 1.5rem; color: var(--red)">${txt}</p>`;
        document.getElementById('restart-diag').style.display = 'inline-block';
    }
};

// Inicializace a Eventy
document.addEventListener('DOMContentLoaded', () => {
    // Navigace
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = () => app.nav(btn.dataset.target);
    });

    // Diagnostika restart
    document.getElementById('restart-diag').onclick = function() {
        this.style.display = 'none';
        app.renderDiag(0);
    };

    // Deník - LocalStorage
    const form = document.getElementById('service-form');
    const hist = document.getElementById('history');
    let db = JSON.parse(localStorage.getItem('gasfix_logs')) || [];

    const draw = () => {
        hist.innerHTML = '';
        db.reverse().forEach(entry => {
            hist.innerHTML += `<div class="log-item">
                <div class="log-meta">${entry.date} | ${entry.mth}</div>
                <div>${entry.desc}</div>
            </div>`;
        });
    };

    form.onsubmit = (e) => {
        e.preventDefault();
        db.push({
            date: document.getElementById('date').value,
            mth: document.getElementById('mth').value,
            desc: document.getElementById('desc').value
        });
        localStorage.setItem('gasfix_logs', JSON.stringify(db));
        draw();
        form.reset();
    };

    app.renderDiag(0);
    draw();
});