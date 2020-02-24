(function() {
    'use strict';

    var popupWrapperElement = document.querySelector('.popup-wrapper'),
        popupListElement = document.querySelector('.specialist-list-popup'),
        scrollLock = false;

    document
        .getElementById('popup-close-btn')
        .addEventListener('click', onPopupCloseBtnClick);

    function showIcon(imageElement) {
        imageElement.classList.add('visible');
    }

    function buildList(data, template, target, onClickHandler) {
        var listItemTemplate = template,
            listItemTarget = target;

        data.forEach(function(specialist, index) {
            var listItem =
                    'content' in document.createElement('template')
                        ? document.importNode(listItemTemplate.content, true)
                        : document
                              .querySelector(
                                  '#specialist-list-item-template li'
                              )
                              .cloneNode(true),
                linksWrapper = listItem.querySelector('.sociall-links'),
                twitterLink = listItem.querySelector('.twitter-link'),
                linkedInLink = listItem.querySelector('.li-link'),
                fbLink = listItem.querySelector('.fb-link'),
                emailLink = listItem.querySelector('.email-link');

            listItem
                .querySelector('.specialist-photo')
                .setAttribute('src', specialist.photoURL);

            listItem.querySelector('h1').textContent = specialist.name;
            listItem.querySelector('address').textContent = specialist.location;
            listItem.querySelector('.company').textContent = specialist.company;
            listItem.querySelector(
                '.devices'
            ).textContent = specialist.devices.join(', ');

            if (listItem.querySelector('.bio-text')) {
                listItem.querySelector('.bio-text').textContent =
                    specialist.bio;
            }

            if (specialist.twitterURL) {
                twitterLink.setAttribute('href', specialist.twitterURL);
                showIcon(twitterLink);
            } else {
                twitterLink.parentNode.removeChild(twitterLink);
            }

            if (specialist.lnURL) {
                linkedInLink.setAttribute('href', specialist.lnURL);
                showIcon(linkedInLink);
            } else {
                linkedInLink.parentNode.removeChild(linkedInLink);
            }

            if (specialist.facebookURL) {
                fbLink.setAttribute('href', specialist.facebookURL);
                showIcon(fbLink);
            } else {
                fbLink.parentNode.removeChild(fbLink);
            }

            if (specialist.emailURL) {
                emailLink.setAttribute('href', 'mailto:' + specialist.emailURL);
                showIcon(emailLink);
            } else {
                emailLink.parentNode.removeChild(emailLink);
            }

            if (!linksWrapper.children.length) {
                linksWrapper.parentNode.removeChild(linksWrapper);
            }

            listItemTarget.appendChild(listItem);

            if (onClickHandler) {
                var insertedItem = listItemTarget.querySelectorAll(
                    '.specialist'
                )[index];

                insertedItem.addEventListener('click', function(event) {
                    onClickHandler(event, index);
                });
            }
        });
    }

    function onItemClick(event, index) {
        if (
            event.target.parentElement.tagName === 'A' &&
            event.target.parentElement.contains(event.target)
        ) {
            return;
        }

        showPopup(index);
        popupListElement.scroll(
            index * popupListElement.getClientRects()[0].width,
            0
        );
    }

    function handleLoad(data) {
        var specialists = JSON.parse(data.target.response);

        buildList(
            specialists,
            document.getElementById('specialist-list-item-template'),
            document.querySelector('.specialist-list'),
            onItemClick
        );
        buildList(
            specialists,
            document.getElementById('specialist-popup-item-template'),
            popupListElement
        );
    }

    function hidePopup() {
        popupWrapperElement.classList.remove('opened');
    }

    function showPopup() {
        popupWrapperElement.classList.add('opened');
    }

    function lockForScrolling() {
        var scroll = popupListElement.scrollLeft;

        scrollLock = true;

        setTimeout(function() {
            if (popupListElement.scrollLeft === scroll) {
                scrollLock = false;
            } else {
                lockForScrolling();
            }
        }, 100);
    }

    function onPrevClick() {
        if (scrollLock) return;

        popupListElement.scroll({
            left: Math.max(
                0,
                popupListElement.scrollLeft -
                    popupListElement.getClientRects()[0].width
            ),
            behavior: 'smooth',
        });

        lockForScrolling();
    }

    function onNextClick() {
        if (scrollLock) return;

        popupListElement.scroll({
            left: Math.min(
                popupListElement.firstElementChild.getClientRects()[0].width *
                    popupListElement.childElementCount,
                popupListElement.scrollLeft +
                    popupListElement.getClientRects()[0].width
            ),
            behavior: 'smooth',
        });

        lockForScrolling();
    }

    function onPopupWrapperClick(event) {
        if (event.target.classList.contains('popup-wrapper')) {
            hidePopup();
        }
    }

    function init() {
        var client = new XMLHttpRequest();

        client.onload = handleLoad;
        client.open('GET', 'specialists.json');
        client.send(null);

        document.querySelector('.prev').addEventListener('click', onPrevClick);
        document.querySelector('.next').addEventListener('click', onNextClick);

        popupWrapperElement.addEventListener('click', onPopupWrapperClick);

        window.addEventListener('click', function(event) {
            if (
                event.target.tagName === 'A' ||
                event.target.parentElement.tagName === 'A'
            ) {
                console.log(event.target.tagName);
                event.stopPropagation();
            }
        });
    }

    function onPopupCloseBtnClick() {
        hidePopup();
    }

    function onWindowResize() {
        hidePopup();
    }

    window.addEventListener('load', init);
    window.addEventListener('resize', onWindowResize);
})();
