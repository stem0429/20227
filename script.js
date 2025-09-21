// 로그인/회원가입 모달 기능
// 로그인 상태 관리 및 UI 갱신
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userInfo = document.getElementById('userInfo');
    const userIdLabel = document.getElementById('userIdLabel');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginUser = localStorage.getItem('loginUser');
    if (loginUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            userIdLabel.textContent = loginUser + '님';
            // 마이페이지 버튼 이벤트 연결
            const mypageBtn = document.getElementById('mypageBtn');
            if (mypageBtn) {
                mypageBtn.onclick = function() {
                    window.location.href = 'mypage.html';
                };
            }
        }
    } else {
        if (loginBtn) loginBtn.style.display = '';
        if (signupBtn) signupBtn.style.display = '';
        if (userInfo) userInfo.style.display = 'none';
    }
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            localStorage.removeItem('loginUser');
            updateAuthUI();
        };
    }
    // 마이페이지 모달 닫기
    const closeMypageModal = document.getElementById('closeMypageModal');
    const mypageModal = document.getElementById('mypageModal');
    if (closeMypageModal && mypageModal) {
        closeMypageModal.onclick = function() {
            mypageModal.style.display = 'none';
        };
    }
    window.addEventListener('click', (e) => {
        if (e.target === mypageModal) mypageModal.style.display = 'none';
    });
}

const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// 모달 열기/닫기
if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', () => {
        console.log('로그인 버튼 클릭됨');
        loginModal.style.display = 'flex';
        loginModal.style.justifyContent = 'center';
        loginModal.style.alignItems = 'center';
    });
}
if (signupBtn && signupModal) {
    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'flex';
    });
}
if (closeLoginModal && loginModal) {
    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
}
if (closeSignupModal && signupModal) {
    closeSignupModal.addEventListener('click', () => {
        signupModal.style.display = 'none';
    });
}
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === signupModal) signupModal.style.display = 'none';
});

// 회원가입/로그인 시뮬레이션 (localStorage)
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('signupId').value.trim();
        const pw = document.getElementById('signupPw').value;
        if (!id || !pw) {
            alert('아이디와 비밀번호를 입력하세요.');
            return;
        }
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[id]) {
            alert('이미 존재하는 아이디입니다.');
            return;
        }
        users[id] = pw;
        localStorage.setItem('users', JSON.stringify(users));
        alert('회원가입이 완료되었습니다!');
        signupModal.style.display = 'none';
    });
}
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('loginId').value.trim();
        const pw = document.getElementById('loginPw').value;
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (!users[id] || users[id] !== pw) {
            alert('아이디 또는 비밀번호가 올바르지 않습니다.');
            return;
        }
        alert(`${id}님, 로그인되었습니다!`);
        localStorage.setItem('loginUser', id);
        loginModal.style.display = 'none';
        updateAuthUI();
    });
}
// 카테고리 필터링 기능 (여러 카테고리 지원)
// 페이지 로드시 로그인 상태 UI 갱신
updateAuthUI();
const categoryBtns = document.querySelectorAll('.category-btn');
if (categoryBtns.length > 0) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selected = btn.getAttribute('data-category');
            let visibleCount = 0;
            document.querySelectorAll('.product').forEach(product => {
                const prodCat = product.getAttribute('data-category') || '';
                // 쉼표로 구분된 카테고리 배열로 변환
                const prodCatArr = prodCat.split(',').map(s => s.trim());
                if (selected === 'all' || prodCatArr.includes(selected)) {
                    product.style.display = '';
                    visibleCount++;
                } else {
                    product.style.display = 'none';
                }
            });
            // 상품 없음 메시지 처리
            let noProductMsg = document.getElementById('noProductMsg');
            if (!noProductMsg) {
                const productList = document.querySelector('.product-list');
                noProductMsg = document.createElement('div');
                noProductMsg.id = 'noProductMsg';
                noProductMsg.textContent = '상품이 존재하지 않습니다.';
                noProductMsg.style.textAlign = 'center';
                noProductMsg.style.color = '#888';
                noProductMsg.style.fontSize = '1.1rem';
                noProductMsg.style.margin = '40px 0';
                productList.parentNode.insertBefore(noProductMsg, productList.nextSibling);
            }
            if (visibleCount === 0) {
                noProductMsg.style.display = 'block';
            } else {
                noProductMsg.style.display = 'none';
            }
            // 검색창 초기화
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
        });
    });
}
// 상품 검색 기능
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.trim().toLowerCase();
        document.querySelectorAll('.product').forEach(product => {
            const name = product.querySelector('h3').textContent.toLowerCase();
            if (name.includes(keyword)) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    });
}
const buyBtn = document.getElementById('buyBtn');
// 구매하기 기능
if (buyBtn) {
    buyBtn.addEventListener('click', () => {
        const loginUser = localStorage.getItem('loginUser');
        if (!loginUser) {
            alert('로그인 후 이용 가능합니다.');
            return;
        }
        if (cartItems.length === 0) {
            alert('장바구니가 비어 있습니다.');
            return;
        }
        let msg = '구매가 완료되었습니다!\n\n구매 내역:\n';
        cartItems.forEach(item => {
            msg += `- ${item.name} x ${item.count}\n`;
        });
        alert(msg);
        // 구매내역 localStorage 저장
        let history = [];
        try {
            history = JSON.parse(localStorage.getItem('purchase_' + loginUser) || '[]');
        } catch(e) { history = []; }
        history.push({
            date: new Date().toLocaleString(),
            items: cartItems.map(item => ({ name: item.name, count: item.count }))
        });
        localStorage.setItem('purchase_' + loginUser, JSON.stringify(history));
        cartItems = [];
        cartCount = 0;
        updateCartBtn();
        openCartModal();
    });
}
const clearCartBtn = document.getElementById('clearCartBtn');
// 장바구니 비우기 기능
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cartItems = [];
        cartCount = 0;
        updateCartBtn();
        openCartModal();
    });
}

// 장바구니 기능



let cartCount = 0;
let cartItems = [];
const cartBtn = document.getElementById('cartBtn');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartModal = document.getElementById('cartModal');
const closeCartModal = document.getElementById('closeCartModal');
const cartList = document.getElementById('cartList');

// 상품을 객체로 관리: {name, img, count}
function addToCart(product) {
    const name = product.querySelector('h3').textContent;
    const img = product.querySelector('img').getAttribute('src');
    // 이미 담긴 상품인지 확인
    const found = cartItems.find(item => item.name === name);
    if (found) {
        found.count++;
    } else {
        cartItems.push({ name, img, count: 1 });
    }
    cartCount++;
    updateCartBtn();
}

function updateCartBtn() {
    cartBtn.textContent = `🛒 장바구니 (${cartCount})`;
}

function openCartModal() {
    cartList.innerHTML = '';
    if (cartItems.length === 0) {
        const li = document.createElement('li');
        li.textContent = '장바구니가 비어 있습니다.';
        cartList.appendChild(li);
    } else {
        cartItems.forEach((item, idx) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.gap = '12px';
            // 이미지
            const img = document.createElement('img');
            img.src = item.img;
            img.alt = item.name;
            img.style.width = '48px';
            img.style.height = '48px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            // 이름과 개수
            const info = document.createElement('span');
            info.textContent = `${item.name} x ${item.count}`;
            // 삭제 버튼
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '제거';
            removeBtn.style.marginLeft = 'auto';
            removeBtn.style.background = '#e74c3c';
            removeBtn.style.color = '#fff';
            removeBtn.style.border = 'none';
            removeBtn.style.borderRadius = '6px';
            removeBtn.style.padding = '6px 12px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.fontSize = '0.95rem';
            removeBtn.addEventListener('click', () => {
                cartCount -= item.count;
                cartItems.splice(idx, 1);
                updateCartBtn();
                openCartModal();
            });
            li.appendChild(img);
            li.appendChild(info);
            li.appendChild(removeBtn);
            cartList.appendChild(li);
        });
    }
    cartModal.style.display = 'block';
}

function closeCart() {
    cartModal.style.display = 'none';
}

addToCartButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const product = e.target.closest('.product');
        addToCart(product);
    });
});

cartBtn.addEventListener('click', openCartModal);
closeCartModal.addEventListener('click', closeCart);

// 모달 바깥 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCart();
    }
});

updateCartBtn();

