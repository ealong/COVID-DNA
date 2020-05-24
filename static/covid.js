$(".custom-file-input").on("change", function() {
	var fileName = $(this).val().split("\\").pop();
	console.log(fileName);
	$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
	
	if ((fileName.indexOf('.txt') !== -1) || (fileName.indexOf('.csv') !== -1) || (fileName.indexOf('.tsv') !== -1)) { //TODO: Better way of checking contains w/ compatibility?
		$("input[type=file]").parse({
			config: {
				complete: function(results, file) {
					console.log("This file done:", file, results);
					
					rsid_index = -1;
					alleles_index = -1;
					
					alleles = [];
					/*
					0 - ACE2 rs4646127

					‘G’ = Common allele, normal expression of ACE2
					‘A’ = Decreased tissue expression of ACE2, candidate SNP for possible coronavirus resistance
					About a quarter of all people have at least one copy of the ‘A’ allele worldwide. However, while 35.2% of women have at least one copy, only 16% of men do.
					The ‘A’ allele is considerably more common in people of European (44.1%) descent and considerably less common in people of East Asian (1%) descent.

					1 - ACE2 rs1996225

					‘T’ = Common allele, normal expression of ACE2
					‘C’ = Decreased tissue expression of ACE2, candidate SNP for possible coronavirus resistance
					More than half of all people worldwide have at least one copy of the ‘C’ allele worldwide. However, while 89% of women have at least one copy, only 26% of men do.
					The ‘C’ allele is considerably more common in people of European (71%) descent and considerably less common in people of East Asian (39%) descent.

					2 - ACE2 rs2158082

					‘A’ = Common allele, normal expression of ACE2
					‘G’ = Decreased tissue expression of ACE2, candidate SNP for possible coronavirus resistance
					Almost a quarter of all people have at least one copy of the ‘G’ allele worldwide. However, while 32% of women have at least one copy, only 16% of men do.
					The ‘G’ allele is considerably more common in people of European (59%) descent and considerably less common in people of East Asian (1%) or African (4%) descent.

					3 - ACE2 rs4830974

					‘A’ = Common allele, normal expression of ACE2
					‘G’ = Decreased tissue expression of ACE2, candidate SNP for possible coronavirus resistance
					About 36% of all people worldwide have at least one copy of the ‘G’ allele worldwide. However, while 47% of women have at least one copy, only 25% of men do.
					The ‘G’ allele is considerably more common in people of European (59%) descent and considerably less common in people of East Asian (10%) descent.

					*/
					
					results.data.forEach(function(row) { //Each row
						for (let i = 0; i < row.length; i++) { //Inside row
							if(rsid_index === -1 || alleles_index === -1) { // Find columns
								if (row[i].toLowerCase() === 'rsid') {
									rsid_index = i;
								}
								
								if (row[i].toLowerCase() === 'result') {
									alleles_index = i;
								}
							} else {
								if (row[rsid_index] === 'rs4646127') {
									alleles[0] = row[alleles_index];
									$('#al-0').text(alleles[0]);
									//animateResult($('#al-0'), success);
									$("#al-0").animate({left: '250px'});
								} else if (row[rsid_index] === 'rs1996225') {
									alleles[1] = row[alleles_index];
									$('#al-1').text(alleles[1]);
								} else if (row[rsid_index] === 'rs2158082') {
									alleles[2] = row[alleles_index];
									$('#al-2').text(alleles[2]);
								} else if (row[rsid_index] === 'rs4830974') {
									alleles[3] = row[alleles_index];
									animateResult(3, "clear");
									/* $('#al-3').fadeOut(500, function() {
										$('#pill-3').removeClass('bg-white');
										$(this).text(alleles[3]).fadeIn(500);
									});
									$("#pill-3").animate({'background-color': '#00FF00'}, 3000); */
									//$('#al-3').css('color', "#ff8484");
								}
							}
						}
					});
					console.log(rsid_index);
					console.log(alleles_index);
					console.log(alleles);
				}
			},
			complete: function() {
				console.log("All files done!");
			}
		});
	} else { //Not txt or csv, throw error
		console.log('Wrong file format');
	}
});

function decideResult(index, value) {
	switch(index) {
		case 0:
			if (value.split('G').length - 1 === 2) {
				return 'normal'; //TODO
			} else if (value === 'AA') {
				return 'warn';
			} 
	}
	return result;
}

function animateResult(index, result) {
	color = "";
	
	switch(result) {
		case "clear":
			color = '#00FF00';
			break;
		case "het":
			color = "orange";
			break;
		case "warn":
			color = "red";
			break;
		default: break;
	}
	
	$('#al-' + index).fadeOut(500, function() {
		$('#pill-' + index).removeClass('bg-white');
		$(this).text(alleles[index]).fadeIn(500);
	});
	$('#pill-' + index).animate({'background-color': color}, 3000);
}