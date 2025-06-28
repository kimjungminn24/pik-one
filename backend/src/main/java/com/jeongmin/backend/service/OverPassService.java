package com.jeongmin.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jeongmin.backend.client.OverpassFeignClient;
import com.jeongmin.backend.dto.LocationCheckRequest;
import com.jeongmin.backend.dto.LocationCheckResponse;
import com.jeongmin.backend.entity.DecorType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OverPassService {

    private final OverpassFeignClient overpassFeignClient;
    private final ObjectMapper objectMapper;

    public LocationCheckResponse checkLocationDecorTypes(LocationCheckRequest request) throws Exception {
        String query = String.format("""
                [out:json];
                (
                  node(around:%f,%f,%f);
                  way(around:%f,%f,%f);
                );
                out center;
                """, 100.0, request.lat(), request.lng(), 100.0, request.lat(), request.lng());

        String response = overpassFeignClient.fetchOverpassData(query);

        JsonNode root = objectMapper.readTree(response);
        JsonNode elements = root.get("elements");

        Set<DecorType> nearbyDecorTypes = new HashSet<>();

        if (elements != null && elements.isArray()) {
            for (JsonNode element : elements) {
                JsonNode tagsNode = element.get("tags");
                if (tagsNode == null) continue;

                Map<String, String> tags = new HashMap<>();
                Iterator<Map.Entry<String, JsonNode>> fields = tagsNode.fields();
                while (fields.hasNext()) {
                    Map.Entry<String, JsonNode> entry = fields.next();
                    tags.put(entry.getKey(), entry.getValue().asText());
                }

                Set<String> simpleTags = new HashSet<>();
                for (Map.Entry<String, String> entry : tags.entrySet()) {
                    System.out.println(entry.getKey() + ": " + entry.getValue());
                    simpleTags.add(entry.getKey() + "=" + entry.getValue());
                }

                for (DecorType decorType : DecorType.values()) {
                    List<String> tagConditions = decorType.getTags();

                    boolean matched = false;
                    for (String tagCondition : tagConditions) {
                        if (tagCondition.contains("AND")) {
                            Map<String, String> conditionMap = new HashMap<>();
                            String[] conditions = tagCondition.split("AND");
                            for (String cond : conditions) {
                                String[] kv = cond.trim().split("=");
                                if (kv.length == 2) {
                                    conditionMap.put(kv[0].trim(), kv[1].trim());
                                }
                            }

                            matched = true;
                            for (Map.Entry<String, String> condEntry : conditionMap.entrySet()) {
                                String key = condEntry.getKey();
                                String value = condEntry.getValue();
                                if (!value.equals(tags.get(key))) {
                                    matched = false;
                                    break;
                                }
                            }
                        } else {
                            matched = simpleTags.contains(tagCondition);
                        }

                        if (matched) {
                            nearbyDecorTypes.add(decorType);
                            break;
                        }
                    }
                }
            }
        }

        boolean isRegisterable = nearbyDecorTypes.isEmpty()
                || (nearbyDecorTypes.size() == 1 && nearbyDecorTypes.contains(request.type()));

        return new LocationCheckResponse(isRegisterable, new ArrayList<>(nearbyDecorTypes));
    }

}
