window.addEventListener('load', initStart);
window.addEventListener('click', (e)=> {
	if(e.target.classList.contains('init-btn'))
		init();
	else if(e.target.classList.contains('side-btn')){
		toggleClass(e.target);
		getInfo(e.target.id);
	}
	else if(e.target.classList.contains('node')){
		toggleChildeElements(e);
	}
	else if(e.target.classList.contains('close-btn')){
		destroy();
	}
})

function initStart(){
	init_btn = document.createElement('a');
	init_btn.classList.add('init-btn');
	init_btn.innerText = 'Tree';
	document.querySelector('body').appendChild(init_btn);
}

function init(){
	document.querySelector('.init-btn').classList.add('hide');
	const body_elem = document.querySelector('body');
	// body_elem.classList.add('overlay');
	// get main divs
	const body_content = document.querySelectorAll('body > *');
	treeBuild(body_elem);
	AddTreeNodes(body_content);
	reorderTree();
	getInfo(document.querySelector('.side-btn.active').id);
}

function treeBuild(body_elem){
	const html_tree_edu_app = document.createElement('div');
	html_tree_edu_app.classList.add('html-tree-edu-app', 'overlay');
	const tree_container = document.createElement('div');
	tree_container.classList.add('tree-container');

	const close_btn = document.createElement('a');
	close_btn.innerText = 'x';
	close_btn.classList.add('close-btn');

	const side_links = document.createElement('div');
	side_links.classList.add('side_links');

	const node_container = document.createElement('div');
	node_container.classList.add('node-container');

	const elems_btn = document.createElement('a');
	elems_btn.classList.add('side-btn','active');
	elems_btn.id = 'nodeName';
	elems_btn.text = 'Node';

	const class_elems_btn = document.createElement('a');
	class_elems_btn.classList.add('side-btn');
	class_elems_btn.id = 'class';
	class_elems_btn.text = 'Class';

	const id_elems_btn = document.createElement('a');
	id_elems_btn.classList.add('side-btn');
	id_elems_btn.id = 'id';
	id_elems_btn.text = 'ID';

	side_links.appendChild(elems_btn);
	side_links.appendChild(class_elems_btn);
	side_links.appendChild(id_elems_btn);
	tree_container.prepend(node_container);
	tree_container.prepend(side_links);
	tree_container.prepend(close_btn);
	html_tree_edu_app.prepend(tree_container);
	body_elem.prepend(html_tree_edu_app);
}

let flag = 1;
function AddTreeNodes(body_content){
	let level = 0;
	for(let i=0; i<body_content.length; i++){
		if(checkElem(body_content[i])){
			body_content[i].dataset.elemid = flag++; 
			// node elem
			if(body_content[i].classList.contains('html-tree-edu-app') || body_content[i].classList.contains('init-btn')) continue;
			if(body_content[i].childNodes.length > 0) 
				{
					level = depthLevel(body_content[i]);
					buildNode(body_content[i], level);
					AddTreeNodes(body_content[i].childNodes);
				}
			else
			{
				level = depthLevel(body_content[i]);
			 	buildNode(body_content[i], level);
			}
		}else if(!checkElem(body_content[i])){
			// text elem
		}
	}
}

function checkElem(elem){
	return (elem.nodeName === "#text" || elem.nodeName === "#comment")? false : true;
}

function buildNode(elem,level){	
	const elem_div = document.createElement('div');
	elem_div.classList.add('node');
	elem_div.id = flag - 1;
	elem_div.dataset.parentid = `${elem.parentNode.dataset.elemid? elem.parentNode.dataset.elemid : undefined}`;
	if(level > 0){
		elem_div.classList.add('depth');
	}if(elem.childNodes.length > 0) elem_div.classList.add('hasChild');
	 	document.querySelector('.node-container').appendChild(elem_div);
}

function toggleClass(elem){
	let siblings = getSiblings(elem);
	siblings.map(siblin =>{ 
		if(siblin.classList.contains('active')){
			if(siblin === elem) return;
			else {siblin.classList.remove('active'); elem.classList.add('active')}
		}
	});
}

function reorderTree(){
	let cont = document.querySelectorAll('.node-container > *');
	for(i=0; i<cont.length; i++){
		for(j=1; j<cont.length-1; j++){
			if(cont[i].id === cont[j].dataset.parentid)
				cont[i].appendChild(cont[j]);
		}
	}
}

function getInfo(type){
	let treeCont = document.querySelectorAll('.node-container *');
	let bodyContent = document.querySelectorAll('body *:not(.html-tree-edu-app *)');
	for(i=0; i<treeCont.length; i++){
		for(j=0; j<bodyContent.length; j++){
			if(treeCont[i].nodeName && bodyContent[j].nodeName && treeCont[i].id === bodyContent[j].dataset.elemid){	 
				if(treeCont[i].firstChild && treeCont[i].firstChild.nodeName === '#text')
					treeCont[i].removeChild(treeCont[i].firstChild);
				let textNode;
				if(type === 'id')
					{textNode = document.createTextNode(bodyContent[j].id);}
				else if(type === 'class')
					{textNode = document.createTextNode(bodyContent[j].classList);}
				else if(type === 'nodeName')
					{textNode = document.createTextNode(bodyContent[j].nodeName);}
				treeCont[i].prepend(textNode);
				break;
			}
		}
	}		
}

function toggleChildeElements(e){
	if(e.target.classList.contains('hasChildCollapsed'))
		e.target.classList.remove('hasChildCollapsed');
	else{
		e.target.classList.add('hasChildCollapsed');
	}
}

function destroy(){
	document.querySelector('.html-tree-edu-app').classList.remove('overlay');
	document.querySelector('.html-tree-edu-app').classList.add('hide');
	document.querySelector('.init-btn').classList.remove('hide');
}

function depthLevel(elem){
	let level = 0;
	element = elem;	
	if(checkElem(element))
		while(element.parentNode.nodeName !== 'BODY'){
			level++;
			element = element.parentNode;
		}
	return level;
}

// helper function to get all siblings for an element
function getSiblings(elem){
	let siblings_arr  = [];
	let first_sibln = elem.parentNode.firstChild;
	while(first_sibln){
		if(first_sibln.nodeType === 1 && first_sibln !== elem)
			siblings_arr.push(first_sibln);
		first_sibln = first_sibln.nextSibling;
	}
	return siblings_arr;
} 

