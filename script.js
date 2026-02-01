// ========================================
// 거산 ENG - 회사 소개 웹페이지 스크립트
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // 헤더 스크롤 효과
    initHeaderScroll();
    
    // 모바일 메뉴
    initMobileMenu();
    
    // 숫자 카운트 애니메이션
    initCountAnimation();
    
    // 스크롤 애니메이션
    initScrollAnimations();
    
    // 스무스 스크롤
    initSmoothScroll();
    
    // 폼 제출
    initFormSubmit();
});

// ========================================
// 헤더 스크롤 효과
// ========================================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ========================================
// 모바일 메뉴
// ========================================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // 메뉴 링크 클릭 시 메뉴 닫기
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ========================================
// 숫자 카운트 애니메이션
// ========================================
function initCountAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateNumbers() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateNumber();
        });
    }
    
    // Intersection Observer: 통계 블록(.about-stats)이 화면에 보일 때 애니메이션 실행
    // 모바일에서 .about 전체는 길어서 threshold 0.5에 도달하지 않을 수 있으므로,
    // 통계 영역만 관찰하고 threshold를 낮춤
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateNumbers();
            }
        });
    }, { threshold: 0.2 });
    
    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        observer.observe(aboutStats);
        // 모바일 등에서 통계가 이미 뷰포트 안에 있으면 한 번 확인 후 애니메이션 실행
        function checkStatsInView() {
            const rect = aboutStats.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView && !animated) {
                animated = true;
                animateNumbers();
            }
        }
        setTimeout(checkStatsInView, 300);
    }
}

// ========================================
// 스크롤 애니메이션
// ========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .value-card, .portfolio-item, .contact-item'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

// ========================================
// 스무스 스크롤
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// 폼 제출 처리
// ========================================
function initFormSubmit() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // 제출 버튼 상태 변경
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '전송 중...';
            submitBtn.disabled = true;
            
            // 실제로는 여기서 서버로 데이터를 전송합니다
            // 현재는 시뮬레이션을 위해 타임아웃 사용
            setTimeout(() => {
                alert('문의가 성공적으로 접수되었습니다.\n빠른 시일 내에 연락 드리겠습니다.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// ========================================
// 유틸리티 함수
// ========================================

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스로틀 함수
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 스크롤 진행률 표시 (옵션)
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #e67e22, #f39c12);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, 10));
}

// 페이지 로드 시 스크롤 진행률 표시 초기화
// initScrollProgress(); // 필요시 주석 해제
